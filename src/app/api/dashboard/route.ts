import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get the user from the request (you'll need to implement auth middleware)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract user ID from token (simplified - you'll need proper JWT verification)
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Fetch properties with their latest values
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select(`
        *,
        property_values!inner(
          value_amount,
          value_type,
          source,
          value_date
        ),
        tenants(
          id,
          first_name,
          last_name,
          monthly_rent,
          is_active,
          lease_end_date
        ),
        payments(
          id,
          payment_date,
          due_date,
          amount,
          status,
          payment_type
        )
      `)
      .eq('landlord_id', userId)
      .order('created_at', { ascending: false });

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    // Fetch tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('landlord_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }

    // Process properties to calculate metrics
    const processedProperties = properties?.map(property => {
      const latestValue = property.property_values?.[0];
      const activeTenant = property.tenants?.find((tenant: any) => tenant.is_active);
      const latestPayment = property.payments?.[0];

      // Calculate payment status
      let paymentStatus = 'on_time';
      if (latestPayment) {
        const dueDate = new Date(latestPayment.due_date);
        const paymentDate = new Date(latestPayment.payment_date);
        const today = new Date();
        
        if (latestPayment.status === 'paid') {
          if (paymentDate > dueDate) {
            paymentStatus = 'late';
          }
        } else if (latestPayment.status === 'overdue') {
          paymentStatus = 'overdue';
        } else if (today > dueDate) {
          paymentStatus = 'overdue';
        }
      }

      return {
        id: property.id,
        address: `${property.address}${property.unit_number ? ` - ${property.unit_number}` : ''}`,
        value: latestValue?.value_amount || 0,
        monthlyRent: activeTenant?.monthly_rent || 0,
        isOccupied: !!activeTenant,
        lastPaymentDate: latestPayment?.payment_date || null,
        paymentStatus,
        zillowValue: latestValue?.source === 'zillow' ? latestValue.value_amount : null,
      };
    }) || [];

    // Calculate metrics
    const totalValue = processedProperties.reduce((sum, prop) => sum + prop.value, 0);
    const monthlyRentCollected = processedProperties
      .filter(prop => prop.paymentStatus === 'on_time')
      .reduce((sum, prop) => sum + prop.monthlyRent, 0);
    const monthlyRentToCollect = processedProperties
      .filter(prop => prop.paymentStatus !== 'on_time')
      .reduce((sum, prop) => sum + prop.monthlyRent, 0);
    const occupancyRate = processedProperties.length > 0 
      ? (processedProperties.filter(prop => prop.isOccupied).length / processedProperties.length) * 100 
      : 0;
    const latePayments = processedProperties.filter(prop => prop.paymentStatus === 'late').length;
    const overduePayments = processedProperties.filter(prop => prop.paymentStatus === 'overdue').length;

    const metrics = {
      totalValue,
      monthlyRentCollected,
      monthlyRentToCollect,
      occupancyRate,
      latePayments,
      overduePayments,
    };

    // Process tasks
    const processedTasks = tasks?.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      type: task.task_type,
      priority: task.priority,
      dueDate: task.due_date,
      completedDate: task.completed_date,
      propertyId: task.property_id,
    })) || [];

    return NextResponse.json({
      properties: processedProperties,
      tasks: processedTasks,
      metrics,
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 