-- Add image URL columns for game question options
ALTER TABLE game_questions ADD COLUMN IF NOT EXISTS option_a_image_url VARCHAR(500);
ALTER TABLE game_questions ADD COLUMN IF NOT EXISTS option_b_image_url VARCHAR(500);
ALTER TABLE game_questions ADD COLUMN IF NOT EXISTS option_c_image_url VARCHAR(500);

