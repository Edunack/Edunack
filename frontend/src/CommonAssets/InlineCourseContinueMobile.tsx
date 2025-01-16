import "./InlineCourseContinueMobile.css";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  author: string;
  link: string;
}

function InlineCourseContinueMobile({ id, title, author, link }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    window.open(link, "_blank");
  };

  return (
    <div id="mobileInlineCourseContinue">
      <div id="mobileCourseInfoContinue">
        <span style={{ fontWeight: "400" }}>
          {title}
          <br />
          by {author}
        </span>
      </div>
      <div id="mobileCourseSVG">
        <svg
          width="7vh"
          height="7vh"
          viewBox="0 0 43 43"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => navigate(`/course/${id}`)}
          className="svgs"
        >
          <rect width="43" height="43" rx="11" fill="#7B4D7B" />
          <circle
            cx="31"
            cy="22"
            r="3"
            transform="rotate(90 31 22)"
            fill="#171117"
          />
          <circle
            cx="13"
            cy="22"
            r="3"
            transform="rotate(90 13 22)"
            fill="#171117"
          />
          <circle
            cx="22"
            cy="22"
            r="3"
            transform="rotate(90 22 22)"
            fill="#171117"
          />
        </svg>
        <svg
          width="7vh"
          height="7vh"
          viewBox="0 0 43 43"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleClick}
        >
          <rect width="43" height="43" rx="11" fill="#BE88BE" />
          <path
            d="M29.1584 15.5858C28.3773 14.8047 27.111 14.8047 26.3299 15.5858C25.5489 16.3668 25.5489 17.6332 26.3299 18.4142L29.1584 15.5858ZM26.3299 18.4142L32.5852 24.6695L35.4136 21.841L29.1584 15.5858L26.3299 18.4142Z"
            fill="black"
          />
          <path
            d="M29.159 28.7652C28.3779 29.5462 27.1116 29.5462 26.3305 28.7652C25.5495 27.9841 25.5495 26.7178 26.3305 25.9367L29.159 28.7652ZM35.4142 22.5099L29.159 28.7652L26.3305 25.9367L32.5858 19.6815L35.4142 22.5099Z"
            fill="black"
          />
          <path
            d="M21.7873 15.5858C21.0062 14.8047 19.7399 14.8047 18.9588 15.5858C18.1778 16.3668 18.1778 17.6332 18.9588 18.4142L21.7873 15.5858ZM18.9588 18.4142L25.2141 24.6695L28.0425 21.841L21.7873 15.5858L18.9588 18.4142Z"
            fill="black"
          />
          <path
            d="M21.7879 28.7652C21.0068 29.5462 19.7405 29.5462 18.9594 28.7652C18.1784 27.9841 18.1784 26.7178 18.9594 25.9367L21.7879 28.7652ZM28.0431 22.5099L21.7879 28.7652L18.9594 25.9367L25.2147 19.6815L28.0431 22.5099Z"
            fill="black"
          />
          <path
            d="M14.4142 15.5858C13.6332 14.8047 12.3668 14.8047 11.5858 15.5858C10.8047 16.3668 10.8047 17.6332 11.5858 18.4142L14.4142 15.5858ZM11.5858 18.4142L17.841 24.6695L20.6695 21.841L14.4142 15.5858L11.5858 18.4142Z"
            fill="black"
          />
          <path
            d="M14.4148 28.7652C13.6338 29.5462 12.3674 29.5462 11.5864 28.7652C10.8053 27.9841 10.8053 26.7178 11.5864 25.9367L14.4148 28.7652ZM20.6701 22.5099L14.4148 28.7652L11.5864 25.9367L17.8416 19.6815L20.6701 22.5099Z"
            fill="black"
          />
        </svg>
      </div>
    </div>
  );
}

export default InlineCourseContinueMobile;
