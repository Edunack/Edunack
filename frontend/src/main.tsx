import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./routes/MainPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./routes/Menu.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
