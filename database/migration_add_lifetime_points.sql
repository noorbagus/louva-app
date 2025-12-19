-- Migration: Add lifetime_points column to users table
-- Run this to update existing database with lifetime points system

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'lifetime_points'
    ) THEN
        ALTER TABLE users ADD COLUMN lifetime_points INTEGER DEFAULT 0;
    END IF;
END $$;

-- Migrate existing data
UPDATE users
SET lifetime_points = total_points
WHERE lifetime_points = 0 OR lifetime_points IS NULL;

-- Update trigger to handle lifetime_points
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

-- Verify migration
SELECT
    id,
    email,
    full_name,
    membership_level,
    total_points,
    lifetime_points,
    CASE
        WHEN lifetime_points >= 1000 THEN 'Gold'
        WHEN lifetime_points >= 500 THEN 'Silver'
        ELSE 'Bronze'
    END as calculated_level
FROM users
ORDER BY created_at;