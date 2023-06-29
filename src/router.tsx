import { createBrowserRouter, Navigate } from "react-router-dom";
import RootPage from "./pages/root";
import { ErrorPage } from "./pages/error";
import PostsPage from "./pages/posts";
import AlbumsPage from "./pages/albums";
import PhotosPage from "./pages/photos";
import TodosPage from "./pages/todos";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootPage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/posts",
                element: <PostsPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: "",
                element: <Navigate to="/posts" />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/albums",
                element: <AlbumsPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/photos/:id",
                element: <PhotosPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/todos",
                element: <TodosPage />,
                errorElement: <ErrorPage />,
            },
        ],
    },
]);
