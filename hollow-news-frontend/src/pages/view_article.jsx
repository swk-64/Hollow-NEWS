import { useContext, useEffect, useState } from "react";
import { get_article_by_id, apiFetch, create_comment, get_article_id_by_slug, get_article_comments } from "../api";
import { useParams, useLoaderData } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { UIContext } from "../UIContext";

export async function articleLoader({ params }) {
    const { slug, id } = params;

    if (id) {
        const article = await get_article_by_id(id);
        const comments = await get_article_comments(id);
        return { article, comments };
    }

    if (slug) {
        const article_id = await get_article_id_by_slug(slug);

        const article = await get_article_by_id(article_id.id);
        const comments = await get_article_comments(article_id.id);
        return { article, comments };
    }

    throw new Response("Not Found", { status: 404 });
}

export default function ViewArticlePage() {
    const { pageTitle, setPageTitle } = useContext(UIContext);
    const { user, login, logout, fetchUser } = useContext(AuthContext);

    const { article, comments } = useLoaderData();

    const [comment, setComment] = useState("");

    useEffect(() => {
        setPageTitle(article.title);
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken");

        const newComment = { comment };

        try {
            const data = await create_comment(article.id, newComment);
            console.log(data);
            window.location.reload();

        } catch (err) {
            console.error(err);
        }
    };

    const CreateCommentArea = user ? (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Leave Comment</button>
            </form>
        </>
    ) : (
        <><p>Log in to leave a comment</p></>
    )

    return (
        <>
            <p>by {article.username} in {article.name} at {article.created_at}</p>
            <p>{article.contents}</p>
            <h2>Leave a comment</h2>
            <div id="commentArea">{CreateCommentArea}</div>
            <h2>Comments</h2>
            <ul>
                {comments.map(c => (
                    <li key={c.id}>
                        {c.contents} <p> — <strong>{c.username}</strong> at <strong>{c.created_at}</strong></p>
                    </li>
                ))}
            </ul>
        </>
    );
}