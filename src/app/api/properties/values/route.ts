import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { zillowService } from '@/lib/zillow';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get the user from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const body = await request.json();
    const { propertyId, useZillow = false } = body;

    // Verify the property belongs to the user
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .eq('landlord_id', userId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    let propertyValue = null;

    if (useZillow) {
      // Try to get value from Zillow
      const zillowValue = await zillowService.getPropertyValue(
        property.address,
        property.city,
        property.state,
        property.zip_code
      );

      if (!zillowValue) {
        // Fallback to mock data for development
        propertyValue = await zillowService.getMockPropertyValue(property.address);
      } else {
        propertyValue = zillowValue;
      }
    } else {
      // Use manual value from request
      const { value, source = 'landlord' } = body;
      
      if (!value) {
        return NextResponse.json({ error: 'Property value is required' }, { status: 400 });
      }

      propertyValue = {
        value: parseFloat(value),
        confidence: 1.0, // Manual values have full confidence
        source,
        lastUpdated: new Date().toISOString(),
      };
    }

    if (!propertyValue) {
      return NextResponse.json({ error: 'Failed to get property value' }, { status: 500 });
    }

    // Insert or update property value
    const { data: insertedValue, error: insertError } = await supabase
      .from('property_values')
      .upsert({
        property_id: propertyId,
        value_type: useZillow ? 'zillow' : 'manual',
        value_amount: propertyValue.value,
        value_date: new Date().toISOString().split('T')[0],
        source: propertyValue.source,
        confidence_score: propertyValue.confidence,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting property value:', insertError);
      return NextResponse.json({ error: 'Failed to save property value' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      propertyValue: insertedValue,
      source: propertyValue.source,
      confidence: propertyValue.confidence,
    });

  } catch (error) {
    console.error('Property value API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the user from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Verify the property belongs to the user
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .eq('landlord_id', userId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Get property values
    const { data: propertyValues, error: valuesError } = await supabase
      .from('property_values')
      .select('*')
      .eq('property_id', propertyId)
      .order('value_date', { ascending: false });

    if (valuesError) {
      console.error('Error fetching property values:', valuesError);
      return NextResponse.json({ error: 'Failed to fetch property values' }, { status: 500 });
    }

    return NextResponse.json({
      property,
      values: propertyValues || [],
    });

  } catch (error) {
    console.error('Property values API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 