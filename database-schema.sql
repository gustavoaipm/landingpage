-- Database Schema for Gustavo.AI Scheduling Service
-- This schema supports AI-powered property service scheduling

-- ========================================
-- SCHEDULING REQUESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS scheduling_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id VARCHAR(255) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('cleaning', 'repair', 'inspection', 'maintenance')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    description TEXT,
    participants TEXT[] NOT NULL, -- Array of email/phone numbers
    preferred_dates DATE[],
    preferred_time_slots TEXT[], -- e.g., ["09:00-11:00", "14:00-16:00"]
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- AI CONVERSATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scheduling_request_id UUID REFERENCES scheduling_requests(id) ON DELETE CASCADE,
    participant_id VARCHAR(255) NOT NULL, -- email or phone number
    conversation_type VARCHAR(20) NOT NULL CHECK (conversation_type IN ('email', 'sms')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- MESSAGES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('email', 'sms')),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'replied', 'failed')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB -- For storing additional info like email headers, SMS delivery receipts, etc.
);

-- ========================================
-- PARTICIPANT AVAILABILITY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS participant_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slots TEXT[] NOT NULL, -- Array of available time slots
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CALENDAR INTEGRATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS calendar_integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_id VARCHAR(255) NOT NULL, -- email or phone number
    calendar_type VARCHAR(20) NOT NULL CHECK (calendar_type IN ('google', 'outlook', 'apple', 'other')),
    calendar_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SCHEDULED EVENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS scheduled_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scheduling_request_id UUID REFERENCES scheduling_requests(id) ON DELETE CASCADE,
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(500),
    participants TEXT[] NOT NULL,
    calendar_event_ids JSONB, -- Store external calendar event IDs
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Scheduling Requests Indexes
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_property_id ON scheduling_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_status ON scheduling_requests(status);
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_created_at ON scheduling_requests(created_at);

-- AI Conversations Indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_request_id ON ai_conversations(scheduling_request_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_participant_id ON ai_conversations(participant_id);

-- Messages Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- Participant Availability Indexes
CREATE INDEX IF NOT EXISTS idx_participant_availability_conversation_id ON participant_availability(conversation_id);
CREATE INDEX IF NOT EXISTS idx_participant_availability_date ON participant_availability(date);

-- Calendar Integrations Indexes
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_participant_id ON calendar_integrations(participant_id);
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_calendar_type ON calendar_integrations(calendar_type);

-- Scheduled Events Indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_events_request_id ON scheduled_events(scheduling_request_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_events_start_time ON scheduled_events(start_time);
CREATE INDEX IF NOT EXISTS idx_scheduled_events_status ON scheduled_events(status);

-- ========================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_scheduling_requests_updated_at BEFORE UPDATE ON scheduling_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_integrations_updated_at BEFORE UPDATE ON calendar_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_events_updated_at BEFORE UPDATE ON scheduled_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE scheduling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (you can restrict this later)
CREATE POLICY "Allow public access to scheduling_requests" ON scheduling_requests FOR ALL USING (true);
CREATE POLICY "Allow public access to ai_conversations" ON ai_conversations FOR ALL USING (true);
CREATE POLICY "Allow public access to messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow public access to participant_availability" ON participant_availability FOR ALL USING (true);
CREATE POLICY "Allow public access to calendar_integrations" ON calendar_integrations FOR ALL USING (true);
CREATE POLICY "Allow public access to scheduled_events" ON scheduled_events FOR ALL USING (true);

-- ========================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- ========================================

-- Insert sample scheduling request
INSERT INTO scheduling_requests (property_id, service_type, priority, description, participants, preferred_dates, preferred_time_slots) 
VALUES (
    'prop_123',
    'cleaning',
    'medium',
    'Regular cleaning service for 2-bedroom apartment',
    ARRAY['john@example.com', '+1234567890'],
    ARRAY['2024-01-15'::DATE, '2024-01-16'::DATE],
    ARRAY['09:00-11:00', '14:00-16:00']
) ON CONFLICT DO NOTHING; 