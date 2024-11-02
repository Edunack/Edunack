import "./Error.css";
import Menu from "../Menu";
import { useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError() as { statusText?: string; message?: string };
  return (
    <>
      <Menu />
      <div id="Error">
        <p>Sorry some error occured</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
}

export default Error;
