-- Insert 5 users
INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123','alice@example.com','hashed123','owner'),
('bobwalker','bob@example.com','hashed456','walker'),
('carol123','carol@example.com','hashed789','owner'),
('patowalker','pato@example.com','hashed303','walker'),
('eveowner','eve@example.com','hashed404','owner');

-- Insert 5 dogs using subqueries to look up owner_id