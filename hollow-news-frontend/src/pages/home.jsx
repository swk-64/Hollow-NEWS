import React, { useEffect, useState, useContext } from "react";
import { get_articles } from "../api";
import { Link } from "react-router-dom";

import { UIContext } from "../UIContext";

function HomePage() {
    const {pageTitle, setPageTitle} = useContext(UIContext);

    const [articles, setArticles] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setPageTitle("Home Page");

        get_articles()
            .then(res => setArticles(res))
            .catch(err => console.error("Error loading articles:", err));
    }, []);



    return (
        <div>
            <div className="content">
                <ul>
                    {articles.map(a => (
                        <li key={a.id}>
                            <Link to={`/articles/${a.slug}`}>{a.title}</Link>
                            <p>By {a.username} in {a.name || "Uncategorized"} at {a.created_at}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="credits">
                <a>Thanks to </a>
                <a href="https://github.com/ElijahGgnore" target="_blank">Elijah</a>
                <a> for the catulator 3d model</a>
            </div>
        </div>
    );
}

export default HomePage;