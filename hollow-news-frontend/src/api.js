const API_URL = "http://localhost:5000/api";

// --- GET articles ---
export async function get_articles() {
    const res = await apiFetch("articles");
    if (!res.ok) {
        throw new Error(`Error fetching articles: ${res.status}`);
    }
    return res.json();
}

export async function get_article_comments(article_id) {
    const res = await apiFetch(`articles/id/${article_id}/comments`);
    if (!res.ok) {
        throw new Error(`Error fetching articles: ${res.status}`);
    }
    return res.json();
}

export async function get_categories() {
    const res = await apiFetch("categories");
    if (!res.ok) {
        throw new Error(`Error fetching categories: ${res.status}`);
    }
    return res.json();
}

export async function get_article_by_id(article_id) {
    const res = await apiFetch(`articles/id/${article_id}`);
    if (!res.ok) {
        throw new Error(`Error fetching articles: ${res.status}`);
    }
    return res.json();
}

export async function create_article(newArticle) {
    const res = await apiFetch("articles", {method: "POST", body: JSON.stringify(newArticle)});
    if (!res.ok) {
        throw new Error(`Error creating article: ${res.status}`);
    }
    return res.json();
}

export async function create_comment(article_id, newComment) {
    const res = await apiFetch(`articles/id/${article_id}/comments`, {method: "POST", body: JSON.stringify(newComment)});
    if (!res.ok) {
        throw new Error(`Error creating article: ${res.status}`);
    }
    return res.json();
}

export async function get_article_id_by_slug(article_slug) {
    const res = await apiFetch(`articles/${article_slug}/id`);
    if (!res.ok) {
        throw new Error(`Error fetching articles: ${res.status}`);
    }
    return res.json();
}

export async function apiFetch(url, options = {}) {
    let accessToken = localStorage.getItem("accessToken");

    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    }

    let res = await fetch(`${API_URL}/${url}`, {...options, headers});

    if (!res.ok) {
        const refreshToken = localStorage.getItem("refreshToken");

        res = await fetch(`${API_URL}/token/refresh`, {headers, method: "POST", body: JSON.stringify({ refreshToken })});

        // if accessToken update isn't successful
        if (!res.ok) {
            throw new Error("Refresh failed");
        }

        //set new access token
        const data = await res.json();
        accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }

        //retry fetch after successful accessToken update
        res = await fetch(`${API_URL}/${url}`, {...options, headers})
    }

    return res;
}