-- Create user_preferences table
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_gender VARCHAR(50),
    age_range_min INTEGER,
    age_range_max INTEGER,
    cleanliness_level VARCHAR(50),
    noise_tolerance VARCHAR(50),
    guest_policy VARCHAR(50),
    smoking_allowed BOOLEAN DEFAULT FALSE,
    pets_allowed BOOLEAN DEFAULT FALSE,
    sleep_schedule VARCHAR(50),
    work_schedule VARCHAR(50),
    dietary_preferences TEXT,
    hobbies TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user_preferences
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);



