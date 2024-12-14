import { createContext, StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./routes/MainPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./Menu.tsx";
import Login from "./routes/Login.tsx";
import Error from "./routes/Error.tsx";
import Register from "./routes/Register.tsx";
import Ranking from "./routes/Ranking.tsx";
import Search from "./routes/Search.tsx";
import CourseDetail from "./routes/CourseDetail.tsx";
import About from "./routes/About.tsx";
import "./main.css";

const originalFontSizes = new Map<Element, string>();

const storeOriginalFontSizes = () => {
  document.querySelectorAll("*").forEach((element) => {
    if (element instanceof HTMLElement) {
      const currentSize = window.getComputedStyle(element).fontSize;
      if (!originalFontSizes.has(element)) {
        originalFontSizes.set(element, currentSize);
      }
    }
  });
};

export const MagnificationContext = createContext<{
  magnificationLevel: number;
  setMagnificationLevel: React.Dispatch<React.SetStateAction<number>>;
}>({
  magnificationLevel: 1,
  setMagnificationLevel: () => {},
});

const applyMagnification = (
  level: number,
  originalFontSizes: Map<Element, string>
) => {
  document.querySelectorAll("*").forEach((element) => {
    if (element instanceof HTMLElement) {
      const originalSize = originalFontSizes.get(element);
      if (originalSize) {
        element.style.fontSize = parseFloat(originalSize) * level + "px";
      }
    }
  });
};

const AppContainer: React.FC = () => {
  const [magnificationLevel, setMagnificationLevel] = useState(1);

  useEffect(() => {
    storeOriginalFontSizes();

    const observer = new MutationObserver(() => {
      storeOriginalFontSizes();
      applyMagnification(magnificationLevel, originalFontSizes);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [magnificationLevel]);

  useEffect(() => {
    applyMagnification(magnificationLevel, originalFontSizes);
  }, [magnificationLevel]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <MagnificationContext.Provider
          value={{ magnificationLevel, setMagnificationLevel }}
        >
          <Menu />
        </MagnificationContext.Provider>
      ),
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
          element: <Search />,
        },
        {
          path: "Ranking",
          element: <Ranking />,
        },
        {
          path: "course/:id",
          element: <CourseDetail />,
        },
        {
          path: "About",
          element: <About />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContainer />
  </StrictMode>
);
