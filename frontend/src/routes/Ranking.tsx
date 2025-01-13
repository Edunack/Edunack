import Top3 from "./RankingPage/Top3";
import OutsidePodium from "./RankingPage/OutsidePodium";
import FullRanking from "./RankingPage/FullRanking";
import "./Ranking.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

interface Category {
  id: String;
  name: String;
}

function Ranking() {
  const sessionCategoryName = sessionStorage.getItem("categoryName");
  const { categoryName } = useParams<{ categoryName: string }>();
  const [category, setCategory] = useState<Category>();
  const [isDataFetched, setIsDataFetched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getCategoryId = (data: string) => {
    fetch(
      `${window.location.origin}/api/search/categories?` +
        new URLSearchParams({ lang: "en", name: data }),
      {
        method: "GET",
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          sessionStorage.setItem("categoryName", data[0].name);
          setCategory(data[0]);
        }
      });
  };

  const getCourses = () => {
    if (category) {
      fetch(`${window.location.origin}/api/search/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category.id }),
      })
        .then((data) => data.json())
        .then(async (data) => {
          sessionStorage.setItem(
            "category" + category.name.toString(),
            JSON.stringify(data)
          );
          sessionStorage.setItem("categoryName", category.name.toString());
        })
        .then(() => {
          setIsDataFetched(true);
        });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    getCategoryId(data.mobileSearchBar.toString().toLowerCase());
    getCourses();
  };

  useEffect(() => {
    if (!sessionCategoryName && categoryName) getCategoryId(categoryName);
  }, [categoryName, sessionCategoryName]);

  useEffect(() => {
    if (category) getCourses();
  }, [category]);

  useEffect(() => {
    if (isDataFetched) {
      const targetPath = `/Ranking/${sessionStorage.getItem("categoryName")}`;
      if (location.pathname !== targetPath) {
        navigate(targetPath);
      }
      setIsDataFetched(false);
    }
  }, [isDataFetched, location.pathname, navigate]);

  useEffect(() => {
    if (categoryName != sessionStorage.getItem("categoryName")) {
      if (categoryName) {
        console.log("categoryName: " + categoryName);
        sessionStorage.setItem("categoryName", categoryName);
        window.location.reload();
      }
    }
  }, [categoryName]);

  return (
    <div id="ranking">
      <div id="categoryContainer">
        <p id="category">
          BEST CHOICES FOR: <br />
          <span style={{ fontWeight: "bold" }}>
            {sessionCategoryName ? sessionCategoryName : category?.name}
          </span>
        </p>
      </div>
      <div id="mobileRanking">
        <FullRanking />
        <div id="mobileRankingSearch">
          <form
            id="mobileRankingSearchForm"
            onSubmit={handleFormSubmit}
            autoComplete="off"
          >
            <input
              type="text"
              name="mobileSearchBar"
              id="mobileSearchBar"
              placeholder="SEARCH MORE"
            />
          </form>
        </div>
      </div>
      <div id="desktopRanking">
        <Top3 />
        <OutsidePodium />
      </div>
    </div>
  );
}

export default Ranking;
