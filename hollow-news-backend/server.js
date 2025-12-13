const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// --- USERS ---
app.post("/api/users", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
            [username, email, password] // ⚠️ hash password in real app!
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating user");
    }
});

// --- ARTICLES ---
app.get("/api/articles", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.id, a.title, a.slug, a.contents, u.username AS author, c.name AS category
       FROM articles a
       LEFT JOIN users u ON a.author_id = u.id
       LEFT JOIN categories c ON a.category_id = c.id
       ORDER BY a.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching articles");
    }
});

// --- COMMENTS ---
app.get("/api/articles/:id/comments", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.id, c.contents, u.username AS author, c.created_at
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.article_id = $1
       ORDER BY c.created_at ASC`,
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching comments");
    }
});

app.post("/api/articles/:id/comments", async (req, res) => {
    const { contents, author_id } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO comments (contents, author_id, article_id) VALUES ($1, $2, $3) RETURNING *",
            [contents, author_id, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding comment");
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));