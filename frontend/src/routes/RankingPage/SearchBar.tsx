import { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

interface Props {
  onSearch: () => void;
  onUpdateCourses: (courses: Object[]) => void;
}

interface Category {
  id: String;
  name: String;
}

function SearchBar({ onSearch, onUpdateCourses }: Props) {
  const searchRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLUListElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showList, setShowList] = useState(false);

  function removeHash() {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }

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
          console.log(data);
          setCategories(data);
        }
      });
  }

  (window as any).__gcse || ((window as any).__gcse = {});
  (window as any).__gcse = {
    initializationCallback: removeHash,
    searchCallbacks: {
      web: {
        starting: () => {
          //append query
          removeHash();
        },
        rendered: () =>
          setCategories((cat) => {
            fetch("/api/search/google/" + cat[0].id, {
              method: "POST",
              body: document.querySelector("div.gsc-expansionArea")?.innerHTML,
            }).then(() => {
              console.log(cat[0].id);
              fetch("api/search/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: cat[0].id }),
              })
                .then((data) => data.json())
                .then(async (data) => {
                  console.log(data);
                  onUpdateCourses(data);
                  onSearch();
                });
            });
            return cat;
          }),
      },
    },
  };

  window.onload = () => {
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList: any) => {
      let correctMutation = false;
      for (const mutation of mutationList) {
        correctMutation ||= mutation.type === "childList";
      }
      if (correctMutation) {
        let captcha = document.querySelector("#recaptcha-wrapper");
        if (captcha == null) {
          return;
        }
        document.querySelector("#captcha")?.appendChild(captcha);
      }
    };
    const observer = new MutationObserver(callback);
    const target =
      document.getElementsByClassName("gsc-wrapper")[0]?.parentElement;
    if (target) {
      observer.observe(target, config);
    }
  };

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

    input!.value = data.searchBar + "courses";
    (
      ___gcse_0?.querySelector("button.gsc-search-button") as HTMLButtonElement
    )?.click();
  };

  const handleChange = () => {
    const data = new String(searchRef.current?.value);
    setShowList(true);

    updateCategories("" + data);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target as Node) &&
      categoryRef.current &&
      !categoryRef.current.contains(e.target as Node)
    ) {
      setShowList(false);
    }
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const borderRadius =
    categories.length > 0 && showList ? "1vh 0 0 0" : "1vh 0 0 1vh";

  const handleCategoryClick = (category: string) => {
    if (searchRef.current) {
      searchRef.current.value = category;
    }

    updateCategories(category);
    setShowList(false);
  };

  return (
    <>
      <script
        async
        src="https://cse.google.com/cse.js?cx=d29a9f2d99e7b465f"
      ></script>
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
              handleChange();
              setShowList(true);
            }}
            ref={searchRef}
            style={{ borderRadius }}
          />
          <button id="searchBtn" type="submit">
            SEARCH
          </button>
        </div>
        <div id="search_results"></div>
        <div id="captcha"></div>
        <div id="google_search">
          <div className="gcse-searchbox"></div>
          <div className="gcse-searchresults"></div>
        </div>
        {showList && (
          <CategoryList
            categories={categories.map((c) => c.name as string)}
            categoryRef={categoryRef}
            handleCategoryClick={handleCategoryClick}
          />
        )}{" "}
      </form>
    </>
  );
}

export default SearchBar;

interface categoryListProps {
  categories: string[];
  categoryRef: React.RefObject<HTMLUListElement>;
  handleCategoryClick: (category: string) => void;
}

function CategoryList({
  categories,
  categoryRef,
  handleCategoryClick,
}: categoryListProps) {
  return (
    <ul id="categoryList" ref={categoryRef}>
      {categories.map((category, index) => (
        <li key={index} onClick={() => handleCategoryClick(category)}>
          {category}
        </li>
      ))}
    </ul>
  );
}
