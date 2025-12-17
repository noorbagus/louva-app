-- LOUVA Salon Loyalty App Database Schema
-- Create tables for customer loyalty management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  membership_level VARCHAR(20) DEFAULT 'Bronze' CHECK (membership_level IN ('Bronze', 'Silver', 'Gold')),
  total_points INTEGER DEFAULT 0,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE
);

-- Admin users table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('staff', 'manager', 'admin')),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Hair', 'Treatment', 'Nail')),
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL,
  point_multiplier DECIMAL(3,2) DEFAULT 1.0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('cash', 'card', 'transfer', 'ewallet')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  admin_id UUID NOT NULL REFERENCES admins(id),
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
  total_amount INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  payment_notes TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction services junction table (many-to-many)
CREATE TABLE transaction_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  service_price INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('discount', 'service', 'product', 'general')),
  is_active BOOLEAN DEFAULT true,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward redemptions table
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  reward_id UUID NOT NULL REFERENCES rewards(id),
  points_used INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'used' CHECK (status IN ('pending', 'used', 'expired')),
  redemption_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Points history table (audit trail)
CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  transaction_id UUID REFERENCES transactions(id),
  redemption_id UUID REFERENCES reward_redemptions(id),
  points_change INTEGER NOT NULL, -- positive for earned, negative for spent
  balance_after INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_qr_code ON customers(qr_code);
CREATE INDEX idx_customers_membership ON customers(membership_level);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transaction_services_transaction_id ON transaction_services(transaction_id);
CREATE INDEX idx_transaction_services_service_id ON transaction_services(service_id);
CREATE INDEX idx_rewards_points_required ON rewards(points_required);
CREATE INDEX idx_reward_redemptions_customer_id ON reward_redemptions(customer_id);
CREATE INDEX idx_points_history_customer_id ON points_history(customer_id);
CREATE INDEX idx_points_history_created_at ON points_history(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- Customers can only see their own data
CREATE POLICY "Users can view own profile" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);

-- Customers can update their own profile
CREATE POLICY "Users can update own profile" ON customers
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Customers can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Customers can view their own reward redemptions
CREATE POLICY "Users can view own reward redemptions" ON reward_redemptions
  FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Customers can view their own points history
CREATE POLICY "Users can view own points history" ON points_history
  FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Transaction services visibility through parent transaction
CREATE POLICY "Transaction services visible through transaction" ON transaction_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = transaction_services.transaction_id
      AND auth.uid()::text = transactions.customer_id::text
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate customer's current membership level
CREATE OR REPLACE FUNCTION get_membership_level(total_points INTEGER)
RETURNS VARCHAR AS $$
BEGIN
  IF total_points >= 1000 THEN
    RETURN 'Gold';
  ELSIF total_points >= 500 THEN
    RETURN 'Silver';
  ELSE
    RETURN 'Bronze';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update customer membership level
CREATE OR REPLACE FUNCTION update_customer_membership()
RETURNS TRIGGER AS $$
BEGIN
  NEW.membership_level = get_membership_level(NEW.total_points);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update membership level when points change
CREATE TRIGGER update_membership_on_points_change
  BEFORE UPDATE ON customers
  FOR EACH ROW
  WHEN (OLD.total_points IS DISTINCT FROM NEW.total_points)
  EXECUTE FUNCTION update_customer_membership();

-- Insert initial data for payment methods
INSERT INTO payment_methods (name, type) VALUES
('Cash', 'cash'),
('Debit Card', 'card'),
('Credit Card', 'card'),
('Bank Transfer', 'transfer'),
('GoPay', 'ewallet'),
('OVO', 'ewallet'),
('DANA', 'ewallet'),
('QRIS', 'ewallet');

-- Insert initial admin user (Maya Sari)
INSERT INTO admins (name, email, role, phone) VALUES
('Maya Sari', 'maya.sari@louva.com', 'manager', '+628123456789');

-- Insert initial customer (Sari Dewi)
INSERT INTO customers (name, email, phone, membership_level, total_points, qr_code) VALUES
('Sari Dewi', 'sari.dewi@example.com', '+6281234567890', 'Silver', 2450, 'LOUVA_SD001_2024');

-- Insert initial services
INSERT INTO services (name, category, price_min, price_max, point_multiplier, description) VALUES
-- Hair Services
('Hair Cut', 'Hair', 75000, 150000, 1.0, 'Professional hair cutting service'),
('Hair Color', 'Hair', 250000, 600000, 1.2, 'Professional hair coloring service'),
('Hair Treatment', 'Hair', 150000, 400000, 1.1, 'Deep conditioning and treatment'),
('Hair Spa', 'Hair', 200000, 350000, 1.1, 'Relaxing hair spa treatment'),
('Keratin Therapy', 'Hair', 450000, 800000, 1.5, 'Brazilian keratin treatment'),
-- Treatment Services
('Facial Treatment', 'Treatment', 150000, 300000, 1.1, 'Deep cleansing facial'),
('Body Massage', 'Treatment', 200000, 400000, 1.1, 'Full body relaxation massage'),
('Scalp Treatment', 'Treatment', 180000, 350000, 1.2, 'Deep scalp treatment'),
('Manicure', 'Treatment', 80000, 150000, 1.0, 'Professional manicure service'),
('Pedicure', 'Treatment', 100000, 180000, 1.0, 'Professional pedicure service'),
-- Nail Services
('Gel Polish', 'Nail', 120000, 200000, 1.0, 'Long-lasting gel polish'),
('Nail Art', 'Nail', 150000, 300000, 1.2, 'Creative nail art design'),
('Nail Extensions', 'Nail', 200000, 400000, 1.3, 'Professional nail extensions');

-- Insert initial rewards
INSERT INTO rewards (name, description, points_required, category, is_active) VALUES
('10% Discount', 'Get 10% off on your next service', 500, 'discount', true),
('Free Hair Cut', 'Complimentary hair cut service', 1000, 'service', true),
('Hair Treatment Voucher', 'Free hair treatment session', 800, 'service', true),
('15% Discount', 'Get 15% off on any service', 750, 'discount', true),
('Product Discount', '20% off on salon products', 600, 'product', true),
('VIP Service', 'Premium package with multiple services', 2000, 'service', true);

-- Insert sample transaction for testing
INSERT INTO transactions (customer_id, admin_id, payment_method_id, total_amount, points_earned, payment_notes) VALUES
(
  (SELECT id FROM customers WHERE email = 'sari.dewi@example.com'),
  (SELECT id FROM admins WHERE email = 'maya.sari@louva.com'),
  (SELECT id FROM payment_methods WHERE name = 'Cash'),
  250000,
  250,
  'Hair Color + Hair Treatment'
);

-- Get the inserted transaction ID
DO $$
DECLARE
  transaction_uuid UUID;
BEGIN
  SELECT id INTO transaction_uuid FROM transactions ORDER BY created_at DESC LIMIT 1;

  -- Insert transaction services
  INSERT INTO transaction_services (transaction_id, service_id, service_price, points_earned) VALUES
  (transaction_uuid, (SELECT id FROM services WHERE name = 'Hair Color'), 200000, 200),
  (transaction_uuid, (SELECT id FROM services WHERE name = 'Hair Treatment'), 50000, 50);

  -- Insert points history
  INSERT INTO points_history (customer_id, transaction_id, points_change, balance_after, reason) VALUES
  (
    (SELECT id FROM customers WHERE email = 'sari.dewi@example.com'),
    transaction_uuid,
    250,
    (SELECT total_points FROM customers WHERE email = 'sari.dewi@example.com'),
    'Hair Color + Hair Treatment'
  );
END $$;