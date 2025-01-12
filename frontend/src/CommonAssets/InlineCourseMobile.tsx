import Button from "./Button";
import "./InlineCourseMobile.css";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  rating: number;
  numOfRatings: number;
}

function InlineCourseMobile({ id, title, rating, numOfRatings }: Props) {
  const navigate = useNavigate();
  let isOpinion = true;

  console.log(rating, numOfRatings);

  if (rating == 0 && (numOfRatings == 0 || numOfRatings == null)) {
    isOpinion = false;
  }

  return (
    <div id="mobileInlineCourse" onClick={() => navigate(`/course/${id}`)}>
      <div id="mobileCourseInfo">
        <span style={{ fontWeight: "normal" }}>{title}</span>
        <span style={{ fontSize: "65%", fontWeight: "light" }}>
          {isOpinion ? (
            <div id="inlineCourseRatingMobile">
              <svg
                width="2vh"
                height="2vh"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L6.02564 4.05573H9L6.53846 5.97297L7.47214 9L5 6.78885L2.52786 9L3.46154 5.64865L1 4.05573H4.07692L5 1Z"
                  fill="#AD83C3"
                  stroke="#AD83C3"
                  stroke-width="0.5"
                />
              </svg>
              <span style={{ marginLeft: "0.2vw" }}>{rating}</span>
              <span>({numOfRatings})</span>
            </div>
          ) : (
            <span style={{ color: "#ad83c3" }}>no ratings</span>
          )}
        </span>
      </div>
      <Button
        bgColor="#724889"
        boxShadow="0px 0px 10px 0px #B085B4"
        color="#EBD1EB"
        width="40%"
        height="80%"
        borderRadius="7px"
        padding="0"
        zIndex={1}
      >
        more about
      </Button>
    </div>
  );
}

export default InlineCourseMobile;
