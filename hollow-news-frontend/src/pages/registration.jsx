import React, { useState, useEffect, useContext } from "react";

import { UIContext} from "../UIContext"

export default function CreateArticleForm() {
    const {pageTitle, setPageTitle} = useContext(UIContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birth_date, setBirthDate] = useState([]);

    useEffect(() => {
        setPageTitle("Registration");
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = { username, email, password };

        try {
            const res = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (!res.ok) throw new Error("Registration failed.");

            const data = await res.json();
            console.log("Registered successful:", data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    {/*<label>Username:</label>*/}
                    <input
                        type="text"
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    {/*<label>Email:</label>*/}
                    <input
                        type="text"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    {/*<label>Password:</label>*/}
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Sign up</button>
            </form>
        </div>
    );
}
