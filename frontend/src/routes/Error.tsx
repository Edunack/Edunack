import "./Error.css";
import Menu from "../Menu";
import { useRouteError } from "react-router-dom";

function Error() {
  //const location = useLocation();
  const error = useRouteError() as { statusText?: string; message?: string };
  //const error = location.state?.message || "Not Found";
  return (
    <>
      <Menu />
      <div id="Error">
        <p>Sorry some error occured</p>
        <p>
          <i>{error.message || error.statusText}</i>
        </p>
      </div>
    </>
  );
}

export default Error;
