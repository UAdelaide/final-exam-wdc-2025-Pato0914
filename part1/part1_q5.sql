-- Insert 5 users
INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123','alice@example.com','hashed123','owner'),
('bobwalker','bob@example.com','hashed456','walker'),
('carol123','carol@example.com','hashed789','owner'),
('patowalker','pato@example.com','hashed303','walker'),
('eveowner','eve@example.com','hashed404','owner');

-- Insert 5 dogs using subqueries to look up owner_id
INSERT INTO Dogs (owner_id, name, size)
VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carole123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'eveowner'), 'Rocky', 'large'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Daisy', 'medium'),
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Milo', 'small');

-- Insert 5 walk requests using subqueries to get dog_id
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-10 08:00:00', 30, 'City Park', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Daisy'), '2025-06-10 08:00:00', 30, 'Hillside Trail', 'cancelled'),
((SELECT dog_id FROM Dogs WHERE name = 'Milo'), '2025-06-10 08:00:00', 30, 'Riverbank Walk', 'open'),