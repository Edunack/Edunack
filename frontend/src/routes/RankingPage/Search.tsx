import "./Search.css";

function Search() {
  return (
    <form id="search">
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
