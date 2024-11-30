import { StrictMode, useState } from "react";
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
import Search from "./routes/Search.tsx";
import "./main.css";

const AppContainer: React.FC = () => {
  const { isMagnified } = useAccessibility();
  const [courses, setCourses] = useState<Object[]>([]);
  const [category, setCategory] = useState<string>("");

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
          path: "Search",
          element: (
            <Search
              onUpdateCourses={setCourses}
              setCategoryName={setCategory}
            />
          ),
        },
        {
          path: "Ranking",
          element: <Ranking courses={courses} category={category} />,
        },
      ],
    },
  ]);

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
