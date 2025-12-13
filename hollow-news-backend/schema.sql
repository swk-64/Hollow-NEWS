-- Users table
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(100) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL, -- store hashed passwords!
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            category_name VARCHAR(100) NOT NULL,
                            slug VARCHAR(100) UNIQUE NOT NULL
);

-- Articles table
CREATE TABLE articles (
                          id SERIAL PRIMARY KEY,
                          title VARCHAR(200) NOT NULL,
                          category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                          contents TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          slug VARCHAR(200) UNIQUE NOT NULL,
                          author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE comments (
                          id SERIAL PRIMARY KEY,
                          contents TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          article_id INT NOT NULL REFERENCES articles(id) ON DELETE CASCADE
);
