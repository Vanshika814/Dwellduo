-- Create user_game_answers table
CREATE TABLE user_game_answers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES game_questions(id) ON DELETE CASCADE,
    answer VARCHAR(255) NOT NULL,
    answer_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_question UNIQUE (user_id, question_id)
);

-- Create indexes for user_game_answers
CREATE INDEX idx_user_game_answers_user_id ON user_game_answers(user_id);
CREATE INDEX idx_user_game_answers_question_id ON user_game_answers(question_id);
CREATE INDEX idx_user_game_answers_user_question ON user_game_answers(user_id, question_id);



