-- Portfolio Management Schema for Gustavo AI Landing
-- This schema supports the landlord dashboard with properties, tasks, and metrics

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    unit_number TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    property_type TEXT NOT NULL DEFAULT 'residential', -- residential, commercial, mixed
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    year_built INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property values table (supports both manual and Zillow values)
CREATE TABLE IF NOT EXISTS property_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    value_type TEXT NOT NULL DEFAULT 'manual', -- manual, zillow, estimated
    value_amount DECIMAL(12,2) NOT NULL,
    value_date DATE NOT NULL,
    source TEXT, -- 'landlord', 'zillow', 'zestimate', etc.
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00 for automated estimates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, value_date)
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    lease_start_date DATE NOT NULL,
    lease_end_date DATE,
    monthly_rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type TEXT NOT NULL DEFAULT 'rent', -- rent, deposit, late_fee, etc.
    status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, late, overdue, partial
    payment_method TEXT, -- check, bank_transfer, online, etc.
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (AI and human tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL DEFAULT 'ai_pending', -- ai_completed, ai_pending, human_attention
    category TEXT NOT NULL DEFAULT 'general', -- maintenance, lease, payment, inspection, etc.
    priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
    status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    due_date DATE,
    completed_date TIMESTAMP WITH TIME ZONE,
    assigned_to TEXT, -- 'ai', 'landlord', 'contractor', etc.
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    cost DECIMAL(10,2),
    ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00 for AI tasks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property maintenance requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general', -- plumbing, electrical, hvac, etc.
    priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, emergency
    status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, completed, cancelled
    reported_date DATE NOT NULL DEFAULT CURRENT_DATE,
    scheduled_date DATE,
    completed_date DATE,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    contractor_name TEXT,
    contractor_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property inspections
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    inspection_type TEXT NOT NULL DEFAULT 'routine', -- routine, move_in, move_out, maintenance
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    inspector_name TEXT,
    inspector_contact TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    findings TEXT,
    recommendations TEXT,
    photos_urls TEXT[], -- Array of photo URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zillow API cache (to avoid hitting rate limits)
CREATE TABLE IF NOT EXISTS zillow_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_address TEXT NOT NULL,
    zillow_data JSONB NOT NULL,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(property_address)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_landlord_id ON properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_properties_address ON properties(address);
CREATE INDEX IF NOT EXISTS idx_property_values_property_id ON property_values(property_id);
CREATE INDEX IF NOT EXISTS idx_property_values_date ON property_values(value_date);
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants(is_active);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_landlord_id ON tasks(landlord_id);
CREATE INDEX IF NOT EXISTS idx_tasks_property_id ON tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property_id ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_inspections_property_id ON inspections(property_id);
CREATE INDEX IF NOT EXISTS idx_inspections_scheduled_date ON inspections(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_zillow_cache_expires ON zillow_cache(expires_at);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Landlords can view their own properties" ON properties FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can insert their own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Landlords can update their own properties" ON properties FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can delete their own properties" ON properties FOR DELETE USING (auth.uid() = landlord_id);

-- Property values policies
CREATE POLICY "Landlords can view property values for their properties" ON property_values FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = property_values.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can insert property values for their properties" ON property_values FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = property_values.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can update property values for their properties" ON property_values FOR UPDATE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = property_values.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can delete property values for their properties" ON property_values FOR DELETE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = property_values.property_id AND properties.landlord_id = auth.uid())
);

-- Tenants policies
CREATE POLICY "Landlords can view tenants for their properties" ON tenants FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = tenants.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can insert tenants for their properties" ON tenants FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = tenants.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can update tenants for their properties" ON tenants FOR UPDATE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = tenants.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can delete tenants for their properties" ON tenants FOR DELETE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = tenants.property_id AND properties.landlord_id = auth.uid())
);

-- Payments policies
CREATE POLICY "Landlords can view payments for their properties" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = payments.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can insert payments for their properties" ON payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = payments.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can update payments for their properties" ON payments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = payments.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can delete payments for their properties" ON payments FOR DELETE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = payments.property_id AND properties.landlord_id = auth.uid())
);

-- Tasks policies
CREATE POLICY "Landlords can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Landlords can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = landlord_id);

-- Maintenance requests policies
CREATE POLICY "Landlords can view maintenance requests for their properties" ON maintenance_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = maintenance_requests.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can insert maintenance requests for their properties" ON maintenance_requests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = maintenance_requests.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can update maintenance requests for their properties" ON maintenance_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = maintenance_requests.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can delete maintenance requests for their properties" ON maintenance_requests FOR DELETE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = maintenance_requests.property_id AND properties.landlord_id = auth.uid())
);

-- Inspections policies
CREATE POLICY "Landlords can view inspections for their properties" ON inspections FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = inspections.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can insert inspections for their properties" ON inspections FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = inspections.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can update inspections for their properties" ON inspections FOR UPDATE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = inspections.property_id AND properties.landlord_id = auth.uid())
);
CREATE POLICY "Landlords can delete inspections for their properties" ON inspections FOR DELETE USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = inspections.property_id AND properties.landlord_id = auth.uid())
);

-- Sample data for testing
INSERT INTO properties (landlord_id, address, city, state, zip_code, property_type, bedrooms, bathrooms, square_feet, year_built) VALUES
    ('00000000-0000-0000-0000-000000000001', '123 Main St', 'Downtown', 'CA', '90210', 'residential', 3, 2.0, 1500, 1995),
    ('00000000-0000-0000-0000-000000000001', '456 Oak Ave', 'Suburbs', 'CA', '90211', 'residential', 2, 1.5, 1200, 2000),
    ('00000000-0000-0000-0000-000000000001', '789 Pine Rd', 'City Center', 'CA', '90212', 'residential', 4, 3.0, 2000, 1985),
    ('00000000-0000-0000-0000-000000000001', '321 Elm St', 'Westside', 'CA', '90213', 'residential', 2, 2.0, 1400, 2010);

-- Sample property values
INSERT INTO property_values (property_id, value_type, value_amount, value_date, source) VALUES
    ((SELECT id FROM properties WHERE address = '123 Main St'), 'manual', 450000, CURRENT_DATE, 'landlord'),
    ((SELECT id FROM properties WHERE address = '456 Oak Ave'), 'manual', 320000, CURRENT_DATE, 'landlord'),
    ((SELECT id FROM properties WHERE address = '789 Pine Rd'), 'manual', 580000, CURRENT_DATE, 'landlord'),
    ((SELECT id FROM properties WHERE address = '321 Elm St'), 'manual', 380000, CURRENT_DATE, 'landlord');

-- Sample tenants
INSERT INTO tenants (property_id, first_name, last_name, email, phone, lease_start_date, lease_end_date, monthly_rent, security_deposit) VALUES
    ((SELECT id FROM properties WHERE address = '123 Main St'), 'John', 'Doe', 'john.doe@email.com', '555-0101', '2023-01-01', '2024-12-31', 2800, 2800),
    ((SELECT id FROM properties WHERE address = '456 Oak Ave'), 'Jane', 'Smith', 'jane.smith@email.com', '555-0102', '2023-02-01', '2024-11-30', 2100, 2100),
    ((SELECT id FROM properties WHERE address = '321 Elm St'), 'Bob', 'Johnson', 'bob.johnson@email.com', '555-0103', '2023-03-01', '2024-10-31', 2400, 2400);

-- Sample payments
INSERT INTO payments (tenant_id, property_id, payment_date, due_date, amount, payment_type, status) VALUES
    ((SELECT id FROM tenants WHERE first_name = 'John'), (SELECT id FROM properties WHERE address = '123 Main St'), '2024-01-15', '2024-01-01', 2800, 'rent', 'paid'),
    ((SELECT id FROM tenants WHERE first_name = 'Jane'), (SELECT id FROM properties WHERE address = '456 Oak Ave'), '2024-01-10', '2024-01-01', 2100, 'rent', 'paid'),
    ((SELECT id FROM tenants WHERE first_name = 'Bob'), (SELECT id FROM properties WHERE address = '321 Elm St'), '2024-01-20', '2024-01-01', 2400, 'rent', 'paid');

-- Sample tasks
INSERT INTO tasks (landlord_id, property_id, title, description, task_type, category, priority, status, due_date, completed_date) VALUES
    ('00000000-0000-0000-0000-000000000001', (SELECT id FROM properties WHERE address = '123 Main St'), 'Lease Renewal Processed', 'AI automatically processed lease renewal for 123 Main St', 'ai_completed', 'lease', 'medium', 'completed', NULL, '2024-01-20'),
    ('00000000-0000-0000-0000-000000000001', (SELECT id FROM properties WHERE address = '456 Oak Ave'), 'Maintenance Request Scheduled', 'Plumbing repair scheduled for 456 Oak Ave', 'ai_pending', 'maintenance', 'high', 'pending', '2024-01-25', NULL),
    ('00000000-0000-0000-0000-000000000001', (SELECT id FROM properties WHERE address = '789 Pine Rd'), 'Late Payment Follow-up', 'Tenant at 789 Pine Rd has overdue payment - requires human intervention', 'human_attention', 'payment', 'high', 'pending', '2024-01-22', NULL),
    ('00000000-0000-0000-0000-000000000001', NULL, 'Property Value Update', 'AI updated property values using latest market data', 'ai_completed', 'general', 'low', 'completed', NULL, '2024-01-19'); 