import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../CommonAssets/Loading";
import { MagnificationContext } from "../main";
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyHeader = {
    height: `${20 * magnificationLevel}vh`,
  };

  const applySearchBar = {
    top: `${isMobile ? 15 * magnificationLevel : "none"}%`,
  };

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
            setIsLoading(true);
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
                })
                .finally(() => setIsLoading(false));
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleChange();
    }
  };

  const handleChange = () => {
    const data = new String(searchRef.current?.value);
    updateBtnPos();
    setShowList(true);

    updateCategories("" + data);
  };

  const borderRadius =
    categories.length > 0 && showList ? "1.5vh 0 0 0" : "1.5vh 0 0 1.5vh";

  const borderRadiusMobile =
    categories.length > 0 && showList ? "1.5vh 1.5vh 0 0" : "1.5vh";

  const borderBottom =
    categories.length > 0 && showList ? "none" : "3px solid #5f3480";

  console.log(borderBottom, borderRadius);

  const displayCategoryList =
    categories.length > 0 && showList ? "block" : "none";

  const handleCategoryClick = (category: string) => {
    if (searchRef.current) {
      searchRef.current.value = category;
      searchRef.current.focus();
    }

    updateBtnPos();
    updateCategories(category);
    setShowList(false);
  };

  return (
    <div id="searchContainer">
      <div id="searchTitleContainer" style={applyHeader}>
        <span id="searchTitle">FIND NEW COURSES</span>
      </div>
      {/*<script
        async
        src="https://cse.google.com/cse.js?cx=d29a9f2d99e7b465f"
      ></script>*/}
      <div id="searchbarDiv" style={applySearchBar}>
        <form id="search" onSubmit={handleSubmit} autoComplete="off">
          {/*<label htmlFor="searchBar" id="searchLabel">
            TYPE IN THE CATEGORY/AUTHOR
          </label>*/}
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="Start typing..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={() => {
              handleChange();
              setShowList(true);
              updateBtnPos();
            }}
            ref={searchRef}
            style={{
              borderRadius: isMobile ? borderRadiusMobile : borderRadius,
              borderBottom: isMobile ? "none" : borderBottom,
            }}
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
      <div id="loadingAnimation">{isLoading && <Loading />}</div>
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
      <div id="ducks">
        <svg
          width="80"
          height="81"
          viewBox="0 0 80 81"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="duck"
        >
          <g clip-path="url(#clip0_511_715)">
            <path
              d="M69.5371 45.4609L67.3911 43.3801L66.6049 46.3234L69.5371 45.4609Z"
              fill="#F15A29"
            />
            <path
              d="M60.5928 52.4791L77.7441 47.4331L65.1961 35.2524L60.5928 52.4791Z"
              fill="#EF4136"
            />
            <path
              d="M17.8927 22.5404C10.6804 35.3901 15.1223 51.3574 27.8134 58.2046C40.506 65.0505 56.6427 60.1841 63.8563 47.3357L17.8927 22.5404Z"
              fill="#FBB040"
            />
            <path
              d="M18.9004 54.8275C21.02 57.1653 23.5491 59.1514 26.4169 60.6967C33.2114 64.3637 41.1044 65.132 48.6431 62.8574C56.1791 60.5853 62.4566 55.5441 66.3186 48.664L67.717 46.1704L16.8313 18.7167L15.4315 21.2116C11.5683 28.0903 10.5828 35.9861 12.6579 43.4442C13.8572 47.7548 15.9946 51.6225 18.8992 54.8262L18.9004 54.8275ZM59.8491 48.4231C56.724 52.7346 52.2983 55.8978 47.1391 57.4542C41.0627 59.2865 34.6969 58.6675 29.215 55.7108C23.7384 52.7518 19.7957 47.8145 18.1209 41.7992C16.7002 36.6943 17.0593 31.3349 19.1027 26.441L59.8491 48.4231Z"
              fill="#F7941D"
            />
            <path
              d="M39.8424 34.4383C43.607 27.7315 52.0287 25.1927 58.6535 28.7661C65.2782 32.3394 67.5954 40.6726 63.8309 47.3795L39.8424 34.4383Z"
              fill="#FBB040"
            />
            <path
              d="M35.9804 35.6021L64.8922 51.203L66.292 48.7082C68.4854 44.7996 69.0456 40.3112 67.8662 36.0749C66.6869 31.836 63.9096 28.3518 60.0499 26.2738C56.1907 24.188 51.7051 23.7526 47.4212 25.0446C43.14 26.334 39.5722 29.1999 37.3774 33.1097L35.979 35.6033L35.9804 35.6021ZM62.4471 43.3862L44.023 33.4458C45.3603 32.0513 47.0378 31.0182 48.9264 30.4491C51.7494 29.5982 54.7078 29.8843 57.2532 31.2584C59.7985 32.6351 61.6304 34.9279 62.407 37.7213C62.9264 39.59 62.9351 41.5336 62.4471 43.3862Z"
              fill="#F7941D"
            />
          </g>
          <defs>
            <clipPath id="clip0_511_715">
              <rect
                width="62.1851"
                height="50.5912"
                fill="white"
                transform="matrix(-0.67169 -0.740832 -0.740832 0.67169 79.248 46.0688)"
              />
            </clipPath>
          </defs>
        </svg>
        <svg
          width="46"
          height="40"
          viewBox="0 0 46 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="duck"
        >
          <g clip-path="url(#clip0_511_726)">
            <path
              d="M36.5 5.11475L34.5852 5.54509L35.9191 7.0355L36.5 5.11475Z"
              fill="#F15A29"
            />
            <path
              d="M37.138 12.5523L40.5352 1.31689L29.3317 3.82808L37.138 12.5523Z"
              fill="#EF4136"
            />
            <path
              d="M5.33448 25.2383C9.79832 33.8214 20.1661 37.1244 28.4915 32.6163C36.8168 28.107 39.9476 17.4935 35.485 8.91024L5.33448 25.2383Z"
              fill="#FBB040"
            />
            <path
              d="M23.4312 36.2975C25.4777 35.9741 27.4781 35.2993 29.3583 34.2799C33.8162 31.8668 37.077 27.8078 38.5391 22.849C40.0015 17.8926 39.4904 12.6315 37.1004 8.03574L36.2337 6.37078L2.85279 24.4463L3.71966 26.1124C6.10845 30.7084 10.0908 34.0894 14.9336 35.6321C17.7326 36.5237 20.6257 36.7408 23.4301 36.2977L23.4312 36.2975ZM34.6412 11.5025C35.8854 14.7697 36.0311 18.3383 35.0304 21.7318C33.8513 25.7283 31.2218 29.0022 27.6261 30.9498C24.0311 32.8936 19.9013 33.2834 15.9949 32.0398C12.68 30.9841 9.86546 28.8593 7.91239 25.9768L34.6412 11.5025Z"
              fill="#F7941D"
            />
            <path
              d="M19.7657 17.461C17.4358 12.9811 19.0704 7.44227 23.4158 5.08874C27.7611 2.73521 33.1717 4.45961 35.5015 8.93955L19.7657 17.461Z"
              fill="#FBB040"
            />
            <path
              d="M19.0166 20.0004L37.9841 9.73133L37.1173 8.06517C35.7593 5.45466 33.4955 3.53267 30.7445 2.65683C27.9921 1.77996 25.0795 2.05232 22.5499 3.4249C20.0162 4.79444 18.1638 7.10161 17.3327 9.91927C16.5011 12.7345 16.792 15.7249 18.1502 18.3366L19.0168 20.0016L19.0166 20.0004ZM32.8113 8.26294L20.7249 14.8074C20.44 13.5713 20.4759 12.2784 20.8425 11.0363C21.3905 9.17973 22.6117 7.65771 24.2819 6.75381C25.9535 5.85093 27.8717 5.66939 29.6853 6.24751C30.8986 6.6343 31.9692 7.32861 32.8113 8.26294Z"
              fill="#F7941D"
            />
          </g>
          <defs>
            <clipPath id="clip0_511_726">
              <rect
                width="40.827"
                height="33.2152"
                fill="white"
                transform="matrix(-0.987742 0.156096 0.156096 0.987742 40.3262 0)"
              />
            </clipPath>
          </defs>
        </svg>

        <svg
          width="103"
          height="104"
          viewBox="0 0 103 104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="duck"
        >
          <g clip-path="url(#clip0_511_704)">
            <path
              d="M12.5781 58.8843L15.3578 56.189L16.3761 60.0014L12.5781 58.8843Z"
              fill="#F15A29"
            />
            <path
              d="M24.1648 67.9744L1.94922 61.4385L18.2023 45.6612L24.1648 67.9744Z"
              fill="#EF4136"
            />
            <path
              d="M79.4723 29.1955C88.8143 45.8393 83.0608 66.5212 66.6223 75.3901C50.1821 84.2575 29.2807 77.9542 19.9372 61.3121L79.4723 29.1955Z"
              fill="#FBB040"
            />
            <path
              d="M78.1673 71.0161C75.4218 74.0441 72.146 76.6166 68.4314 78.6182C59.6307 83.368 49.4072 84.3631 39.6426 81.4169C29.8814 78.4739 21.7503 71.9442 16.7481 63.0327L14.9367 59.8028L80.8474 24.2429L82.6605 27.4744C87.6644 36.3842 88.9408 46.6113 86.253 56.2716C84.6996 61.8549 81.9312 66.8647 78.1688 71.0143L78.1673 71.0161ZM25.1278 62.7206C29.1756 68.3052 34.9081 72.4024 41.5906 74.4183C49.4613 76.7916 57.7066 75.9898 64.8072 72.1601C71.9009 68.3274 77.0077 61.9323 79.177 54.1409C81.0171 47.5287 80.552 40.5868 77.9053 34.2479L25.1278 62.7206Z"
              fill="#F7941D"
            />
            <path
              d="M51.0415 44.6069C46.1654 35.9197 35.257 32.6314 26.6761 37.2598C18.0953 41.8883 15.0939 52.6821 19.97 61.3692L51.0415 44.6069Z"
              fill="#FBB040"
            />
            <path
              d="M56.0428 46.1141L18.5943 66.3214L16.7812 63.0899C13.9401 58.0273 13.2145 52.2137 14.7422 46.7265C16.2696 41.236 19.867 36.7231 24.8663 34.0314C29.865 31.3298 35.6751 30.7659 41.2239 32.4393C46.7692 34.1095 51.3904 37.8216 54.2333 42.8858L56.0446 46.1157L56.0428 46.1141ZM21.7614 56.1966L45.6255 43.3212C43.8933 41.5149 41.7205 40.1768 39.2743 39.4396C35.6177 38.3375 31.7858 38.7081 28.4888 40.4879C25.192 42.271 22.8192 45.2409 21.8133 48.859C21.1405 51.2795 21.1293 53.797 21.7614 56.1966Z"
              fill="#F7941D"
            />
          </g>
          <defs>
            <clipPath id="clip0_511_704">
              <rect
                width="80.5463"
                height="65.5292"
                fill="white"
                transform="translate(0 59.6714) rotate(-47.8024)"
              />
            </clipPath>
          </defs>
        </svg>
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
