import { useState, useContext } from "react";
import { Outlet, Link } from "react-router-dom";

import { get_articles } from "./api";

import hollow from "./assets/hollow48.png";

import { AuthContext } from "./AuthContext";
import { UIContext } from "./UIContext";


export default function App() {
    const { user, login, logout, fetchUser } = useContext(AuthContext);
    const { pageTitle, setPageTitle } = useContext(UIContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const headerAuthArea = user ? (
        <>
            <p>Hello, {user}</p>
            <button type="button" onClick={() => logout()}>Logout</button>
        </>
    ) : (
        <>
            <input type="text"
                   autoComplete="username"
                   value={username}
                   onChange={(e) => {setUsername(e.target.value)}}
                   className="username"
                   placeholder="Username"/>

            <input type="password"
                   value={password}
                   autoComplete="current-password"
                   onChange={(e) => {setPassword(e.target.value)}}
                   className="password"
                   placeholder="Password"/>

            <div className="authButtons">
                <button type="button" className="login-btn" onClick={() => login(username, password)}>Login</button>
                <p id="orText">Or</p>
                <Link to={`/register`} className="register-btn">Register</Link>
            </div>
        </>
    )

return (
    <div>
        <header>
            <nav>
                <Link to={`/`}>
                    <img src={hollow} alt="Home" className="headerLogo"/>
                </Link>
                <div id="nav-left">
                    <Link to={`/articles/new`} className="headerLinks">Create Article</Link>
                </div>
                <form id="headerAuthForm" onSubmit={(e) => e.preventDefault()}>{headerAuthArea}</form>
            </nav>
        </header>
        <main>
            <div id="PageTitle">
                <h1>{pageTitle}</h1>
            </div>
            <Outlet />
        </main>
    </div>
);
}