-- === USERS ===
INSERT INTO users (username, email, password)
VALUES
    ('alice', 'alice@example.com', 'hashedpassword1'),
    ('bob', 'bob@example.com', 'hashedpassword2'),
    ('charlie', 'charlie@example.com', 'hashedpassword3');

-- === CATEGORIES ===
INSERT INTO categories (name, slug)
VALUES
    ('Technology', 'technology'),
    ('Science', 'science'),
    ('Lifestyle', 'lifestyle'),
    ('Travel', 'travel');

-- === ARTICLES ===
INSERT INTO articles (title, category_id, contents, slug, author_id)
VALUES
    ('The Rise of AI', 1, 'Artificial Intelligence is transforming industries worldwide...', 'the-rise-of-ai', 1),
    ('Exploring Quantum Physics', 2, 'Quantum mechanics opens doors to new computing paradigms...', 'exploring-quantum-physics', 2),
    ('Healthy Living Tips', 3, 'Simple lifestyle changes can improve your health...', 'healthy-living-tips', 3),
    ('Backpacking Across Asia', 4, 'A journey through diverse cultures and landscapes...', 'backpacking-across-asia', 1);

-- === COMMENTS ===
INSERT INTO comments (contents, author_id, article_id)
VALUES
    ('Great insights on AI!', 2, 1),
    ('Quantum physics always blows my mind.', 3, 2),
    ('Thanks for the health tips!', 1, 3),
    ('Asia is on my bucket list too.', 2, 4);