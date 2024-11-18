import { useRef } from "react";
import "./Search.css";

interface Props {
  onSearch: () => void;
}

function Search({ onSearch }: Props) {
  let searchRef = useRef<HTMLInputElement>(null);

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

  const handleKeyDown = () => {
    const data = new String(searchRef.current?.value);

    fetch(
      "api/search/categories?" +
        new URLSearchParams({ lang: "en", startsWith: "" + data }),
      {
        method: "GET",
      }
    ).then((data) => data.json());
  };
  return (
    <form id="search" onSubmit={handleSubmit}>
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
          onKeyDown={handleKeyDown}
          ref={searchRef}
        />
        <button id="searchBtn" type="submit">
          SEARCH
        </button>
      </div>
    </form>
  );
}

export default Search;
