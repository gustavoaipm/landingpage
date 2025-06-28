import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.propertyId || !body.serviceType || !body.participants || body.participants.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, serviceType, and participants are required' },
        { status: 400 }
      );
    }

    // Create scheduling request in database
    const { data: schedulingRequest, error: requestError } = await supabase
      .from('scheduling_requests')
      .insert({
        property_id: body.propertyId,
        service_type: body.serviceType,
        priority: body.priority || 'medium',
        description: body.description,
        participants: body.participants,
        preferred_dates: body.preferredDates || [],
        preferred_time_slots: body.preferredTimeSlots || [],
        status: 'pending'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating scheduling request:', requestError);
      return NextResponse.json(
        { error: 'Failed to create scheduling request' },
        { status: 500 }
      );
    }

    // TODO: Phase 2 - Send initial messages to participants
    // TODO: Phase 3 - AI conversation handling

    return NextResponse.json({
      success: true,
      message: 'Scheduling request created successfully',
      requestId: schedulingRequest.id
    });

  } catch (error) {
    console.error('Scheduling API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    const propertyId = searchParams.get('propertyId');

    if (requestId) {
      // Get specific scheduling request
      const { data: schedulingRequest, error } = await supabase
        .from('scheduling_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Scheduling request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ schedulingRequest });
    }

    if (propertyId) {
      // Get all scheduling requests for a property
      const { data: schedulingRequests, error } = await supabase
        .from('scheduling_requests')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch scheduling requests' },
          { status: 500 }
        );
      }

      return NextResponse.json({ schedulingRequests });
    }

    // Get all scheduling requests
    const { data: schedulingRequests, error } = await supabase
      .from('scheduling_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch scheduling requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({ schedulingRequests });

  } catch (error) {
    console.error('Scheduling API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 