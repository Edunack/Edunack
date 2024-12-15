import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

interface Category {
  id: String;
  name: String;
}

function Search() {
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const categoryRef = useRef<HTMLUListElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showList, setShowList] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const navigate = useNavigate();

  // Utility: Remove the hash from the URL
  function removeHash() {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }

  // Fetch categories from API
  function updateCategories(data: string) {
    fetch(
      "api/search/categories?" +
        new URLSearchParams({ lang: "en", name: data }),
      {
        method: "GET",
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("categories: ", data);
          setCategories(data);
        }
      });
  }

  // Update button position based on input field
  const updateBtnPos = () => {
    if (searchRef.current && searchBtnRef.current) {
      const searchBtn = searchBtnRef.current;
      const searchTop = searchRef.current.getBoundingClientRect().top;

      const containerTop = document
        .getElementById("searchContainer")
        ?.getBoundingClientRect().top;

      const relativeTop = searchTop - (containerTop || 0);
      searchBtn.style.top = `${relativeTop}px`;
    }
  };

  // Handle outside clicks
  const handleClickOutside = (e: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target as Node) &&
      categoryRef.current &&
      !categoryRef.current.contains(e.target as Node)
    ) {
      updateBtnPos();
      setShowList(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    let ___gcse_0 = document
      .querySelector("#google_search")
      ?.querySelector("#___gcse_0");
    let input: HTMLInputElement | any =
      ___gcse_0?.querySelector("input.gsc-input");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);

    const catChosen = data.searchBar.toString().toLowerCase();
    const exists = categories.some(
      (category) => category.name.toLowerCase() === catChosen
    );

    if (!exists) {
      alert("Category does not exist!");
      return;
    }

    input!.value = data.searchBar + "courses";
    (
      ___gcse_0?.querySelector("button.gsc-search-button") as HTMLButtonElement
    )?.click();
  };

  // Load Google CSE script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=d29a9f2d99e7b465f";
    script.async = true;
    script.onload = () => {
      console.log("Google CSE script loaded");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Add event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update button position on resize or scroll
  useEffect(() => {
    updateBtnPos();

    window.addEventListener("resize", updateBtnPos);
    window.addEventListener("scroll", updateBtnPos);

    return () => {
      window.addEventListener("resize", updateBtnPos);
      window.addEventListener("scroll", updateBtnPos);
    };
  }, [showList]);

  // Adjust UI when categories or showList change
  useEffect(() => {
    if (showList) {
      updateBtnPos();
    }
    if (searchRef.current && categoryRef.current) {
      const searchBarWidth = searchRef.current.offsetWidth;
      categoryRef.current.style.width = `${searchBarWidth}px`;
      console.log(searchRef.current.style.width);
      console.log(categoryRef.current.style.width);
    }
  }, [categories, showList]);

  (window as any).__gcse || ((window as any).__gcse = {});
  (window as any).__gcse = {
    initializationCallback: () => {
      removeHash();

      const callback = () => {
        console.log("callback");
        let captcha = document.querySelector("#recaptcha-wrapper");
        if (captcha) {
          document.querySelector("#captcha")?.appendChild(captcha);
          // CAPTCHA is displayed, now update the button position
          updateBtnPos();
        }
      };

      // Options for the observer (watching for child additions)
      const config = { childList: true, subtree: true };

      // Get the parent element where CAPTCHA is likely inserted
      const target =
        document.getElementsByClassName("gsc-wrapper")[0]?.parentElement;

      console.log("target: ", target);
      // Create the MutationObserver and start observing
      if (target) {
        const observer = new MutationObserver(callback);
        observer.observe(target, config);

        // Cleanup observer when the component unmounts
        return () => observer.disconnect();
      }
    },
    searchCallbacks: {
      web: {
        starting: () => {
          //append query
          removeHash();
        },
        rendered: () =>
          setCategories((cat) => {
            console.log("cat: ", cat);
            fetch("/api/search/google/" + cat[0].id, {
              method: "POST",
              body: document.querySelector("div.gsc-expansionArea")?.innerHTML,
            }).then(() => {
              console.log(cat[0].id);
              console.log(cat[0].name);
              fetch("api/search/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: cat[0].id }),
              })
                .then((data) => data.json())
                .then(async (data) => {
                  console.log(data);
                  sessionStorage.setItem(
                    "category" + cat[0].name.toString(),
                    JSON.stringify(data)
                  );
                  sessionStorage.setItem(
                    "categoryName",
                    cat[0].name.toString()
                  );
                  setIsDataFetched(true);
                });
            });
            return cat;
          }),
      },
    },
  };

  useEffect(() => {
    if (isDataFetched)
      navigate(`/Ranking/${sessionStorage.getItem("categoryName")}`);
  }, [isDataFetched]);

  //useEffect(() => {
  //  // Observer callback to monitor changes in the DOM
  //  const callback = () => {
  //    let captcha = document.querySelector("#recaptcha-wrapper");
  //    if (captcha) {
  //      // CAPTCHA is displayed, now update the button position
  //      updateBtnPos();
  //    }
  //  };
  //
  //  // Options for the observer (watching for child additions)
  //  const config = { childList: true, subtree: true };
  //
  //  // Get the parent element where CAPTCHA is likely inserted
  //  const target =
  //    document.getElementsByClassName("gsc-wrapper")[0]?.parentElement;
  //
  //  console.log("target: ", target);
  //  // Create the MutationObserver and start observing
  //  if (target) {
  //    const observer = new MutationObserver(callback);
  //    observer.observe(target, config);
  //
  //    // Cleanup observer when the component unmounts
  //    return () => observer.disconnect();
  //  }
  //}, []);

  //useEffect(() => {
  //  const script = document.createElement("script");
  //  script.src = "https://www.google.com/recaptcha/api.js";
  //  script.async = true;
  //  script.onload = () => {
  //    console.log("reCAPTCHA script loaded");
  //    // You can also trigger any further CAPTCHA setup here if needed
  //  };
  //  document.body.appendChild(script);
  //
  //  return () => {
  //    document.body.removeChild(script);
  //  };
  //}, []);

  const handleChange = () => {
    const data = new String(searchRef.current?.value);
    updateBtnPos();
    setShowList(true);

    updateCategories("" + data);
  };

  const borderRadius =
    categories.length > 0 && showList ? "1.5vh 0 0 0" : "1.5vh 0 0 1.5vh";

  const borderBottom =
    categories.length > 0 && showList ? "none" : "3px solid #5f3480";

  const displayCategoryList =
    categories.length > 0 && showList ? "block" : "none";

  const handleCategoryClick = (category: string) => {
    if (searchRef.current) {
      searchRef.current.value = category;
    }

    updateBtnPos();
    updateCategories(category);
    setShowList(false);
  };

  return (
    <div id="searchContainer">
      {/*<script
        async
        src="https://cse.google.com/cse.js?cx=d29a9f2d99e7b465f"
      ></script>*/}
      <div id="searchbarDiv">
        <form id="search" onSubmit={handleSubmit} autoComplete="off">
          {/*<label htmlFor="searchBar" id="searchLabel">
            TYPE IN THE CATEGORY/AUTHOR
          </label>*/}
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="start typing..."
            onChange={handleChange}
            onClick={() => {
              handleChange();
              setShowList(true);
              updateBtnPos();
            }}
            ref={searchRef}
            style={{ borderRadius, borderBottom }}
          />
          {showList && (
            <CategoryList
              categories={categories.map((c) => c.name as string)}
              categoryRef={categoryRef}
              handleCategoryClick={handleCategoryClick}
              style={displayCategoryList}
            />
          )}
          <div id="search_results"></div>
          <div id="captcha"></div>
          <div id="google_search">
            <div className="gcse-searchbox"></div>
            <div className="gcse-searchresults"></div>
          </div>
        </form>
      </div>
      <div id="searchBtnDiv">
        <button id="searchBtn" type="submit" form="search" ref={searchBtnRef}>
          SEARCH
        </button>
        {/*<div id="filterDiv">
          <p>FILTER*: </p>
          <div id="priceBox" className="filterBox">
            <p>PRICE</p>
            <select name="price" form="search">
              <option value="free">free and paid</option>
              <option value="free">free</option>
              <option value="paid">paid</option>
            </select>
          </div>
          <div id="typeBox" className="filterBox">
            <p>TYPE</p>
            <select name="type" form="search">
              <option value="video and text">video and text</option>
              <option value="video">video</option>
              <option value="web course">web course</option>
            </select>
          </div>
        </div>
        <span id="adnotation">
          *WE MIGHT STILL SHOW YOU COURSES THAT SHOULD BE FILTERED
        </span>*/}
      </div>
    </div>
  );
}

export default Search;

interface categoryListProps {
  categories: string[];
  categoryRef: React.RefObject<HTMLUListElement>;
  handleCategoryClick: (category: string) => void;
  style: string;
}

function CategoryList({
  categories,
  categoryRef,
  handleCategoryClick,
  style,
}: categoryListProps) {
  const hasCategories = categories.length > 0;
  return (
    <ul id="categoryList" ref={categoryRef} style={{ display: style }}>
      <div style={{ height: hasCategories ? "1px" : "0" }} id="categoryLine" />
      {categories.map((category, index) => (
        <li key={index} onClick={() => handleCategoryClick(category)}>
          {category}
        </li>
      ))}
    </ul>
  );
}
