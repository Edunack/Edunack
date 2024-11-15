import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./routes/MainPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  AccessibillityProvider,
  useAccessibility,
} from "./AccessibilityContext.tsx";
import Menu from "./Menu.tsx";
import Login from "./routes/Login.tsx";
import Error from "./routes/Error.tsx";
import Register from "./routes/Register.tsx";
import Ranking from "./routes/Ranking.tsx";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Register",
        element: <Register />,
      },
      {
        path: "Ranking",
        element: <Ranking />,
      },
    ],
  },
]);

const AppContainer: React.FC = () => {
  const { isMagnified } = useAccessibility(); // Access the magnification state

  return (
    <div className={isMagnified ? "magnifiedText" : ""}>
      <RouterProvider router={router} />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccessibillityProvider>
      <AppContainer />
    </AccessibillityProvider>
  </StrictMode>
);
