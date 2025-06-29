import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await addToWaitlist(email);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add to waitlist' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully added to waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in waitlist POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      entries: [],
      count: 0,
      message: 'Supabase not configured - demo mode'
    });
  } catch (error) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 