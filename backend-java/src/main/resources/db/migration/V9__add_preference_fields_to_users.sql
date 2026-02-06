-- Add roommate preference fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS budget VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_preference VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender_preference VARCHAR(20);

