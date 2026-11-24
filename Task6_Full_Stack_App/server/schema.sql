-- SaiKet Systems Internship – Task 5: Database Integration
-- PostgreSQL schema for the users table (hosted on Neon)

CREATE TABLE users (
  id         SERIAL PRIMARY KEY,                               -- auto-numbered, never reused
  name       VARCHAR(100) NOT NULL,                            -- required
  email      VARCHAR(255) NOT NULL UNIQUE,                     -- required, no duplicates
  age        INTEGER NOT NULL CHECK (age BETWEEN 1 AND 120),   -- required, 1 to 120
  created_at TIMESTAMP DEFAULT NOW()                           -- set automatically
);

-- Sample data
INSERT INTO users (name, email, age)
VALUES ('Ada Okafor', 'ada@example.com', 25),
       ('Grace Adah', 'grace@example.com', 30);