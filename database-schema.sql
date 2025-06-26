-- AI Scheduling Service Database Schema

-- Properties table (if not already exists)
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  property_type VARCHAR(100),
  owner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduling requests table
CREATE TABLE IF NOT EXISTS scheduling_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('cleaning', 'repair', 'inspection', 'maintenance')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  description TEXT NOT NULL,
  participants TEXT[] NOT NULL, -- Array of email/phone numbers
  preferred_dates DATE[] DEFAULT '{}',
  preferred_time_slots TEXT[] DEFAULT '{}', -- e.g., ["09:00-11:00", "14:00-16:00"]
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'scheduled', 'completed', 'cancelled')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  scheduled_duration INTEGER, -- Duration in minutes
  ai_conversation_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversation sessions
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduling_request_id UUID REFERENCES scheduling_requests(id) ON DELETE CASCADE,
  conversation_type VARCHAR(20) DEFAULT 'scheduling' CHECK (conversation_type IN ('scheduling', 'confirmation', 'rescheduling')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  participants TEXT[] NOT NULL,
  context JSONB DEFAULT '{}', -- AI context and preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation messages
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  participant_id VARCHAR(255) NOT NULL, -- Email or phone number
  message_type VARCHAR(10) NOT NULL CHECK (message_type IN ('email', 'sms')),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  content TEXT NOT NULL,
  subject VARCHAR(255), -- For emails
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'replied', 'failed')),
  external_message_id VARCHAR(255), -- ID from email/SMS service
  metadata JSONB DEFAULT '{}', -- Additional message metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participant availability
CREATE TABLE IF NOT EXISTS participant_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  participant_id VARCHAR(255) NOT NULL,
  available_dates DATE[] DEFAULT '{}',
  available_time_slots TEXT[] DEFAULT '{}',
  unavailable_dates DATE[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}', -- e.g., {"preferred_time": "morning", "max_duration": 120}
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar integrations
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  calendar_type VARCHAR(50) NOT NULL CHECK (calendar_type IN ('google', 'outlook', 'ical', 'custom')),
  calendar_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled events (final confirmed appointments)
CREATE TABLE IF NOT EXISTS scheduled_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduling_request_id UUID REFERENCES scheduling_requests(id) ON DELETE CASCADE,
  calendar_integration_id UUID REFERENCES calendar_integrations(id) ON DELETE SET NULL,
  external_event_id VARCHAR(255), -- ID from calendar service
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  attendees TEXT[] NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('tentative', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_property_id ON scheduling_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_status ON scheduling_requests(status);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_participant_id ON conversation_messages(participant_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_events_start_time ON scheduled_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_property_id ON calendar_integrations(property_id);

-- Row Level Security (RLS) policies
ALTER TABLE scheduling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;

-- Basic policies (you can customize these based on your auth requirements)
CREATE POLICY "Allow public access to scheduling_requests" ON scheduling_requests FOR ALL USING (true);
CREATE POLICY "Allow public access to ai_conversations" ON ai_conversations FOR ALL USING (true);
CREATE POLICY "Allow public access to conversation_messages" ON conversation_messages FOR ALL USING (true);
CREATE POLICY "Allow public access to participant_availability" ON participant_availability FOR ALL USING (true);
CREATE POLICY "Allow public access to calendar_integrations" ON calendar_integrations FOR ALL USING (true);
CREATE POLICY "Allow public access to scheduled_events" ON scheduled_events FOR ALL USING (true); 