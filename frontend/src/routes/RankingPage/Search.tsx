import { useEffect, useRef, useState } from "react";
import "./Search.css";

interface Props {
  onSearch: () => void;
}

function Search({ onSearch }: Props) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);

    fetch(
      "api/search/categories?" +
        new URLSearchParams({ lang: "en", startsWith: "" + data.searchBar }),
      {
        method: "GET",
      }
    )
      .then((data) => data.json())
      .then(async (data) => {
        console.log(data);
        onSearch();
      });
  };

  const handleChange = () => {
    const data = new String(searchRef.current?.value);

    fetch(
      "api/search/categories?" +
        new URLSearchParams({ lang: "en", name: "" + data }),
      {
        method: "GET",
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((item: { name: string }) => item.name));
        }
      });
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShowList(false); // Hide the list when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const borderRadius =
    categories.length > 0 && showList ? "1vh 0 0 0" : "1vh 0 0 1vh";

  return (
    <>
      <form id="search" onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="searchBar" id="searchLabel">
          TYPE IN THE CATEGORY/AUTHOR
        </label>
        <br />
        <div id="searchbarPlusBtn">
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="Type in the category"
            onChange={handleChange}
            onClick={() => {
              handleChange(); // Fetch categories when clicking
              setShowList(true); // Show the list
            }}
            ref={searchRef}
            style={{ borderRadius }}
          />
          <button id="searchBtn" type="submit">
            SEARCH
          </button>
        </div>
        {showList && <CategoryList categories={categories} />}{" "}
        {/* Only show list if showList is true */}
      </form>
    </>
  );
}

export default Search;

interface categoryListProps {
  categories: string[];
}

function CategoryList({ categories }: categoryListProps) {
  return (
    <ul id="categoryList">
      {categories.map((category, index) => (
        <li key={index}>{category}</li>
      ))}
    </ul>
  );
}
