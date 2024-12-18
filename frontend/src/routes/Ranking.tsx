import Top3 from "./RankingPage/Top3";
import OutsidePodium from "./RankingPage/OutsidePodium";
import "./Ranking.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Category {
  id: String;
  name: String;
}

function Ranking() {
  const sessionCategoryName = sessionStorage.getItem("categoryName");
  const { categoryName } = useParams<{ categoryName: string }>();
  const [category, setCategory] = useState<Category>();
  const [isDataFetched, setIsDataFetched] = useState(false);

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
          console.log(data);
          sessionStorage.setItem(
            "category" + category.name.toString(),
            JSON.stringify(data)
          );
          sessionStorage.setItem("categoryName", category.name.toString());
          setIsDataFetched(true);
        });
    }
  };

  useEffect(() => {
    if (!sessionCategoryName && categoryName) getCategoryId(categoryName);
  }, [categoryName, sessionCategoryName]);

  useEffect(() => {
    if (category) getCourses();
  }, [category]);

  console.log("isDataFetched: ", isDataFetched);

  return (
    <div id="ranking">
      <p id="category">
        Top searches in: <br />
        <b>{categoryName}</b>
      </p>
      <Top3 />
      <OutsidePodium />
    </div>
  );
}

export default Ranking;
