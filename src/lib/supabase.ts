import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SchedulingRequest {
  id: string;
  property_manager_email: string;
  service_type: string;
  property_address: string;
  unit_number?: string;
  participants: string[];
  preferred_dates: string[];
  preferred_times: string[];
  additional_notes?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  request_id: string;
  email: string;
  name: string;
  role: string;
  availability: string[];
  response_status: 'pending' | 'responded' | 'confirmed';
  created_at: string;
}

export interface ScheduledEvent {
  id: string;
  request_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  participants: string[];
  calendar_event_ids: Record<string, string>;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface AIConversation {
  id: string;
  scheduling_request_id: string;
  participant_id: string;
  conversation_type: 'email' | 'sms';
  status: 'active' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  message_type: 'email' | 'sms';
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'failed';
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface ParticipantAvailability {
  id: string;
  conversation_id: string;
  date: string;
  time_slots: string[];
  is_available: boolean;
  created_at: string;
}

export interface CalendarIntegration {
  id: string;
  participant_id: string;
  calendar_type: 'google' | 'outlook' | 'apple' | 'other';
  calendar_id: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API functions
export async function addToWaitlist(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);

    if (error) {
      console.error('Error adding to waitlist:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createSchedulingRequest(data: Omit<SchedulingRequest, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string; requestId?: string }> {
  try {
    const { data: result, error } = await supabase
      .from('scheduling_requests')
      .insert([data])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating scheduling request:', error);
      return { success: false, error: error.message };
    }

    return { success: true, requestId: result.id };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSchedulingRequests(): Promise<{ success: boolean; data?: SchedulingRequest[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('scheduling_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scheduling requests:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as SchedulingRequest[] };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 