import { FormEvent } from "react";
import "./Search.css";

interface Props {
  onSearch: () => void;
}

function Search({ onSearch }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
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
        />
        <button id="searchBtn" type="submit">
          SEARCH
        </button>
      </div>
    </form>
  );
}

export default Search;
