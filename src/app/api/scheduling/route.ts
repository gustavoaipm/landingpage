import { NextRequest, NextResponse } from 'next/server';
import { createSchedulingRequest, getSchedulingRequests } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await createSchedulingRequest(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create scheduling request' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Scheduling request created successfully',
        requestId: result.requestId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in scheduling POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await getSchedulingRequests();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch scheduling requests' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      schedulingRequests: result.data || []
    });
  } catch (error) {
    console.error('Error in scheduling GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 