const express = require("express");
const cors = require("cors");
const pool = require("./db");

require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/user", authMiddleware, (req, res) => {
    res.json({ username: req.user.username, id: req.user.id });
});

app.get("/api/ping", async (req, res) => {
    res.json({ message: "pong" })
});

app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username",
            [username, email, passwordHash]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/token", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userResult.rows.length === 0) return res.status(401).json({ error: "Invalid username" });

        const user = userResult.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: "Invalid password" });

        // Access token (short-lived)
        const accessToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        // Refresh token (long-lived)
        const refreshToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unexpected error" });
    }
});

app.post("/api/token/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    try {

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);

            const accessToken = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: "15m" }
            );

            res.json({ accessToken });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/articles/", async (req, res) => {
    try {
        const articlesQuery = `
            SELECT articles.id, articles.title, articles.slug, articles.contents, articles.created_at, categories.name, 
                   users.username FROM articles JOIN users ON articles.author_id = users.id 
                       JOIN categories on articles.category_id = categories.id
        `;
        const result = await pool.query(articlesQuery);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/api/categories", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name FROM categories ORDER BY name");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/articles", authMiddleware, async (req, res) => {
    try {
        const { title, contents, category_id } = req.body;
        const { username, id } = req.user;

        const slug = await makeSlug(title);
        const result = await pool.query(
            "INSERT INTO articles (title, contents, category_id, slug, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, contents, category_id, slug, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/articles/id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const articleQuery = `
            SELECT a.id,
                   a.title,
                   a.contents,
                   a.created_at,
                   u.username,
                   c.name
            FROM articles a
                     JOIN users u ON a.author_id = u.id
                     JOIN categories c ON a.category_id = c.id
            WHERE a.id = $1
        `;

        const article_res = await pool.query(articleQuery, [id]);

        if (article_res.rows.length === 0) {
            return res.status(404).json({ error: "Article not found" });
        }

        const article = article_res.rows[0];
        res.json(article);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/articles/:slug/id", async (req, res) => {
    try {
        const { slug } = req.params;
        const id = await getArticleIdBySlug(slug);
        res.json({ id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/articles/id/:id/comments", authMiddleware, async (req, res) => {
    try {
        const { id: article_id } = req.params;

        const { comment } = req.body;

        const { username, id: author_id } = req.user;

        const result = await pool.query("INSERT INTO comments (contents, author_id, article_id) VALUES ($1, $2, $3) RETURNING *",
            [comment, author_id, article_id])

        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/comments", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM comments")
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/articles/id/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`SELECT 
                                            c.id, 
                                            c.contents, 
                                            c.created_at, 
                                            u.username 
                                        FROM comments c 
                                            JOIN users u ON c.author_id = u.id 
                                        WHERE c.article_id = $1`, [id]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

async function getArticleIdBySlug(slug) {
    const res = await pool.query(
        "SELECT id FROM articles WHERE slug = $1",
        [slug]
    );

    return res.rows[0].id;
}
async function getArticleByIdHandler(req, res, id) {

    const articleQuery = `SELECT a.id AS article_id, a.title, a.contents, a.created_at, u.username, c.category_name 
    FROM articles a JOIN users u ON articles.author_id = users.id 
    JOIN categories c ON articles.category_id = categories.id WHERE articles.id = $1`;

        const article_res = await pool.query(articleQuery, [id]);

        if (article_res.rows.length === 0) {
            return res.status(404).json({ error: "Article not found" });
        }

        return article_res.rows[0];
}

async function makeSlug(title){
    try {
        const result = await pool.query("SELECT slug FROM articles");
        const existingSlugs = result.rows.map(r => r.slug);

        let slug = title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

        if (existingSlugs.includes(slug)) {
            let counter = 1;
            while (existingSlugs.includes(slug)) {
                slug = `${slug}-${counter}`;
                counter++;
            }
        }
        return slug;

    } catch (err) {
        console.error(err);
    }
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded; // attach user info from token
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
}

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});