-- Add location column for PostGIS geography point
ALTER TABLE users ADD COLUMN IF NOT EXISTS location GEOGRAPHY(Point, 4326);
