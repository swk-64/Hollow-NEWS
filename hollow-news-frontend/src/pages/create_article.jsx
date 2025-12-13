import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { UIContext } from "../UIContext";

import { get_articles, get_categories, create_article, apiFetch } from "../api";


export default function CreateArticleForm() {
    const {pageTitle, setPageTitle} = useContext(UIContext);
    const { user, login, logout, fetchUser } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setPageTitle("Create Article");
        get_categories()
            .then(res => res)
            .then(data => setCategories(data))
            .catch(err => console.error("Error loading categories:", err));
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newArticle = { title, contents, category_id: categoryId };
            const data = await create_article(newArticle);
            console.log("Article created:", data);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const CreateArticleArea = user ? (
        <>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Content:</label>
                        <textarea
                            value={contents}
                            onChange={(e) => setContents(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Category:</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Select Category --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Create Article</button>
                </form>
        </>
    ) : (
        <><p>Log in to access this page</p></>
    )

    return (
        <>
            <div id="CreateArticleArea">{CreateArticleArea}</div>
        </>
    );
}
