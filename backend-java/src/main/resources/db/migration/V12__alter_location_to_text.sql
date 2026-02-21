-- Alter location column from geography to text for easier Hibernate compatibility
-- Geography operations will still work via casting
ALTER TABLE users ALTER COLUMN location TYPE TEXT;
