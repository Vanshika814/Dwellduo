-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    -- clerk_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    profile_image VARCHAR(500),
    bio VARCHAR(1000),
    phone_number VARCHAR(20),
    age INTEGER,
    gender VARCHAR(50),
    current_city VARCHAR(255),
    move_in_date TIMESTAMP,
    budget_min INTEGER,
    budget_max INTEGER,
    user_role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_current_city ON users(current_city);
CREATE INDEX idx_users_is_active ON users(is_active);



