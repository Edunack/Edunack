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
import Profile from "./routes/Profile.tsx";
import "./main.css";
import MailConfirmation from "./routes/MailConfimation.tsx";
import PasswordChange from "./routes/passwordChange.tsx";

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
  const startingLevel = sessionStorage.getItem("magnificationLevel")
    ? Number(sessionStorage.getItem("magnificationLevel"))
    : 1;
  const [magnificationLevel, setMagnificationLevel] = useState(startingLevel);

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
    sessionStorage.setItem("magnificationLevel", magnificationLevel.toString());
  }, [magnificationLevel]);

  useEffect(() => {
    const handleResize = () => {
      window.location.reload();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("magnificationLevel")) {
      sessionStorage.setItem("magnificationLevel", "1");
    } else {
      setMagnificationLevel(
        Number(sessionStorage.getItem("magnificationLevel"))
      );
    }
  }, []);

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
          path: "Ranking/:categoryName",
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
        {
          path: "Profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "mail",
      element: <MailConfirmation />,
    },
    {
      path: "passwordChange",
      element: <PasswordChange />,
    },
  ]);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContainer />
  </StrictMode>
);
