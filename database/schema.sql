-- LOUVA Salon Loyalty App - Complete Database Schema
-- Run this after dropping all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (customers)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  phone VARCHAR,
  membership_level VARCHAR DEFAULT 'Bronze',
  total_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  qr_code VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'manager',
  salon_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  min_price DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2),
  points_multiplier DECIMAL(3,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  bank VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  admin_id UUID REFERENCES admins(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  total_amount DECIMAL(10,2) NOT NULL,
  points_earned INTEGER NOT NULL,
  status VARCHAR DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transaction services (many-to-many)
CREATE TABLE transaction_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  service_id UUID REFERENCES services(id),
  price DECIMAL(10,2) NOT NULL,
  points_earned INTEGER NOT NULL
);

-- Points history
CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  transaction_id UUID REFERENCES transactions(id),
  points_change INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  type VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reward redemptions
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  reward_id UUID REFERENCES rewards(id),
  points_used INTEGER NOT NULL,
  status VARCHAR DEFAULT 'pending',
  redeemed_at TIMESTAMP DEFAULT NOW()
);

-- Insert fixed customer account
INSERT INTO users (id, email, full_name, phone, membership_level, total_points, lifetime_points, total_visits, total_spent, qr_code) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sari.dewi@example.com', 'Sari Dewi', '081234567890', 'Silver', 750, 850, 15, 3200000, 'LOUVA_SD001_2024');

-- Insert fixed admin account
INSERT INTO admins (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'maya.sari@louva.com', 'Maya Sari', 'manager');

-- Insert default services
INSERT INTO services (name, category, description, min_price, max_price, points_multiplier) VALUES
('Haircut', 'Hair', 'Potongan rambut basic dengan styling', 50000, 75000, 1.0),
('Hair Color', 'Hair', 'Pewarnaan rambut dengan produk premium', 150000, 300000, 1.2),
('Hair Treatment', 'Hair', 'Perawatan rambut deep conditioning', 100000, 150000, 1.1),
('Facial', 'Treatment', 'Perawatan wajah dasar', 80000, 120000, 1.0),
('Massage', 'Treatment', 'Pijat relaksasi full body', 120000, 200000, 1.1),
('Manicure', 'Nail Care', 'Perawatan kuku tangan basic', 60000, 90000, 1.0),
('Pedicure', 'Nail Care', 'Perawatan kaki kaki basic', 60000, 90000, 1.0),
('Nail Art', 'Nail Care', 'Seni kuku dengan desain custom', 100000, 200000, 1.2);

-- Insert default payment methods
INSERT INTO payment_methods (name, type, bank) VALUES
('Cash', 'cash', NULL),
('QRIS', 'qris', NULL),
('Debit Mandiri', 'debit', 'mandiri'),
('Debit BCA', 'debit', 'bca'),
('Debit Other', 'debit', 'other'),
('Credit Mandiri', 'credit', 'mandiri'),
('Credit BCA', 'credit', 'bca'),
('Credit Other', 'credit', 'other'),
('GoPay', 'ewallet', 'gopay'),
('OVO', 'ewallet', 'ovo'),
('Dana', 'ewallet', 'dana'),
('ShopeePay', 'ewallet', 'shopeepay');

-- Insert sample rewards
INSERT INTO rewards (name, description, points_required) VALUES
('Gratis Haircut', 'Dapatkan potongan rambut gratis untuk semua jenis model', 500),
('Diskon 20% Hair Treatment', 'Diskon 20% untuk semua treatment rambut premium', 300),
('Gratis Manicure & Pedicure', 'Nikmati manicure dan pedicure gratis dengan produk premium', 800),
('Voucher Rp 50.000', 'Voucher potongan Rp 50.000 untuk semua layanan', 250),
('Package VIP Treatment', 'Paket lengkap treatment premium termasuk hair spa, facial, dan massage', 1500);

-- Insert sample transactions
INSERT INTO transactions (user_id, admin_id, payment_method_id, total_amount, points_earned, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 
(SELECT id FROM payment_methods WHERE name = 'Cash' LIMIT 1), 200000, 200, '2024-01-20T14:30:00Z'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
(SELECT id FROM payment_methods WHERE name = 'GoPay' LIMIT 1), 150000, 150, '2024-01-18T10:15:00Z');

-- Create indexes for better performance
CREATE INDEX idx_users_qr_code ON users(qr_code);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_points_history_user_id ON points_history(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on admins" ON admins FOR ALL USING (true);
CREATE POLICY "Allow all operations on transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on points_history" ON points_history FOR ALL USING (true);
CREATE POLICY "Allow all operations on reward_redemptions" ON reward_redemptions FOR ALL USING (true);

-- Create trigger to update user points when transaction is created
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's total points and lifetime points
  UPDATE users
  SET total_points = total_points + NEW.points_earned,
      lifetime_points = lifetime_points + NEW.points_earned,
      total_visits = total_visits + 1,
      total_spent = total_spent + NEW.total_amount,
      updated_at = NOW()
  WHERE id = NEW.user_id;

  -- Update membership level based on lifetime points
  UPDATE users
  SET membership_level = CASE
    WHEN lifetime_points >= 1000 THEN 'Gold'
    WHEN lifetime_points >= 500 THEN 'Silver'
    ELSE 'Bronze'
  END
  WHERE id = NEW.user_id;

  -- Insert into points history
  INSERT INTO points_history (user_id, transaction_id, points_change, balance_after, type, description)
  VALUES (
    NEW.user_id,
    NEW.id,
    NEW.points_earned,
    (SELECT total_points FROM users WHERE id = NEW.user_id),
    'earn',
    'Points earned from transaction'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_points
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();

-- For existing databases, add lifetime_points column with migration:
-- ALTER TABLE users ADD COLUMN lifetime_points INTEGER DEFAULT 0;
-- UPDATE users SET lifetime_points = total_points WHERE lifetime_points = 0;