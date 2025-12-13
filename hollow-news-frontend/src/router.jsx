import { createBrowserRouter } from "react-router-dom";

import RegistrationPage from "./pages/registration";
import HomePage from "./pages/home";
import ViewArticlePage, { articleLoader } from "./pages/view_article";
import CreateArticlePage from "./pages/create_article";
import App from "./App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/articles/id/:id",
                element: <ViewArticlePage />,
                loader: articleLoader,
            },
            {
                path: "/articles/:slug",
                element: <ViewArticlePage />,
                loader: articleLoader,
            },
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "/register",
                element: <RegistrationPage />
            },
            {
                path: "/articles/new",
                element: <CreateArticlePage />
            },
        ],
    },
]);
export default router;