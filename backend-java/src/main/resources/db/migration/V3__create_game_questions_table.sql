-- Create game_questions table
CREATE TABLE game_questions (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    option_a VARCHAR(500),
    option_b VARCHAR(500),
    option_c VARCHAR(500),
    option_d VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    weight INTEGER NOT NULL DEFAULT 1,
    category VARCHAR(100),
    display_order INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for game_questions
CREATE INDEX idx_game_questions_is_active ON game_questions(is_active);
CREATE INDEX idx_game_questions_display_order ON game_questions(display_order);



