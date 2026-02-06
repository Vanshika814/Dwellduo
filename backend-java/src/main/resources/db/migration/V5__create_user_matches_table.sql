-- Create user_matches table
CREATE TABLE user_matches (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    compatibility_score DOUBLE PRECISION NOT NULL,
    preference_score DOUBLE PRECISION,
    game_score DOUBLE PRECISION,
    lifestyle_score DOUBLE PRECISION,
    match_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    user1_liked BOOLEAN NOT NULL DEFAULT FALSE,
    user2_liked BOOLEAN NOT NULL DEFAULT FALSE,
    user1_viewed BOOLEAN NOT NULL DEFAULT FALSE,
    user2_viewed BOOLEAN NOT NULL DEFAULT FALSE,
    matched_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_match UNIQUE (user1_id, user2_id),
    CONSTRAINT chk_different_users CHECK (user1_id != user2_id)
);

-- Create indexes for user_matches
CREATE INDEX idx_user_matches_user1_id ON user_matches(user1_id);
CREATE INDEX idx_user_matches_user2_id ON user_matches(user2_id);
CREATE INDEX idx_user_matches_compatibility_score ON user_matches(compatibility_score);
CREATE INDEX idx_user_matches_match_status ON user_matches(match_status);



