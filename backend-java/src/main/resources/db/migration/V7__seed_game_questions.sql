-- Seed game questions (All with exactly 3 options)
INSERT INTO game_questions (question, type, option_a, option_b, option_c, is_active, weight, category, display_order) VALUES
('What time do you usually go to bed?', 'MULTIPLE_CHOICE', 'Before 11 PM', '11 PM - 1 AM', 'After 1 AM', TRUE, 3, 'lifestyle', 1),
('How often do you clean your living space?', 'MULTIPLE_CHOICE', 'Daily', 'Few times a week', 'Once a week or less', TRUE, 5, 'cleanliness', 2),
('What are your smoking habits?', 'MULTIPLE_CHOICE', 'Non-smoker', 'Occasional smoker', 'Regular smoker', TRUE, 4, 'habits', 3),
('Do you have or plan to have pets?', 'MULTIPLE_CHOICE', 'No pets', 'Small pets (cat/dog)', 'No preference', TRUE, 3, 'lifestyle', 4),
('How often do you have guests over?', 'MULTIPLE_CHOICE', 'Rarely or never', 'Sometimes (1-2 times a month)', 'Often (weekly)', TRUE, 4, 'social', 5),
('What''s your noise tolerance level?', 'MULTIPLE_CHOICE', 'Prefer quiet', 'Moderate noise okay', 'Don''t mind loud', TRUE, 5, 'lifestyle', 6),
('What are your cooking habits?', 'MULTIPLE_CHOICE', 'Cook often at home', 'Mix of both', 'Mostly eat out', TRUE, 2, 'lifestyle', 7),
('What''s your work/study schedule?', 'MULTIPLE_CHOICE', 'Regular 9-5', 'Flexible/Remote', 'Night shifts/Student', TRUE, 3, 'lifestyle', 8),
('How important is a shared living routine?', 'MULTIPLE_CHOICE', 'Not important', 'Somewhat important', 'Very important', TRUE, 4, 'preferences', 9),
('How do you prefer to split chores?', 'MULTIPLE_CHOICE', 'Equal split', 'Flexible arrangement', 'Each does own thing', TRUE, 5, 'cleanliness', 10);



