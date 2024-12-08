import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import "./CourseDetail.css";
import { useParams } from "react-router-dom";
import DisqusElement from "./Disqus";

interface Props {
  courses: any[];
}

function CourseDetail({ courses }: Props) {
  const { id } = useParams<{ id: string }>();
  const course = courses.find((course) => course.id === id);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div id="courseDetail">
      <div>
        <p>{course.name}</p>
        <p>BY {course.author}</p>
        <div id="courseInfoContainer">
          <Tile bgColor="#56346C" border="3px solid #6A4781" borderRadius="2vh">
            user ratings:
            {course.rating}
            your rating:
          </Tile>
          <div>
            <p>{course.url}</p>
            <Button
              bgColor="#412941"
              color="#D8AFD8"
              border="#7C607C"
              borderRadius="2vh"
            >
              go to course
            </Button>
          </div>
        </div>
        <DisqusElement id={course.id} title={course.name} />
      </div>
    </div>
  );
}

export default CourseDetail;
