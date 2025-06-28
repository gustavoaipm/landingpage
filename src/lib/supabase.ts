import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface SchedulingRequest {
  id: string;
  property_id: string;
  service_type: 'cleaning' | 'repair' | 'inspection' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  participants: string[];
  preferred_dates: string[];
  preferred_time_slots: string[];
  status: 'pending' | 'in_progress' | 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
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
  metadata: any;
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

export interface ScheduledEvent {
  id: string;
  scheduling_request_id: string;
  event_title: string;
  event_description: string;
  start_time: string;
  end_time: string;
  location: string;
  participants: string[];
  calendar_event_ids: any;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
} 