import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

import { HomeLayout } from "./HomeLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <div>Page is not found</div>,
        children: [
            {
                index: true, element: <HomeLayout />,
            },
            {
                path: 'upload', element: <HomeLayout />,
            }
        ]
    },
]);
