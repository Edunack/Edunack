import "./Login.css";
import { Form, Link } from "react-router-dom";
import Input from "../CommonAssets/Input";
import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";

function Login() {
  return (
    <div id="Login">
      <div id="LoginPanel">
        <div id="Left">
          <div id="MainText">
            <p id="LoginText">LOG IN</p>
            <span id="LoginSubtext">
              If you do not have account, click{" "}
              <Link to={`Register`} className="LoginPanelLinks">
                here
              </Link>{" "}
              to create one
            </span>
          </div>
          <Form id="Form">
            <Input label="EMAIL" type="text" />
            <Input label="PASSWORD" type="password" margin="2% 0 1.5vh 0" />
            <Button
              bgColor="#90429C"
              color="white"
              fontWeight={700}
              width="100%"
              padding="3%"
              borderRadius="10px"
              margin="1.5vh 0 2vh 0 "
            >
              LOG IN
            </Button>
          </Form>
          <div id="AlternateLoginText">
            <svg
              width="94"
              height="1"
              viewBox="0 0 94 1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line y1="0.5" x2="94" y2="0.5" stroke="#454545" />
            </svg>
            <span>or log in with</span>
            <svg
              width="94"
              height="1"
              viewBox="0 0 94 1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line y1="0.5" x2="94" y2="0.5" stroke="#454545" />
            </svg>
          </div>
          <div id="AlternateLoginMethods">
            <Tile
              bgColor="#D9D9D9"
              shadow="0 0 5px #D9D9D9"
              width="6vh"
              height="2vh"
              borderRadius="7px"
            ></Tile>
            <Tile
              bgColor="#D9D9D9"
              shadow="0 0 5px #D9D9D9"
              width="6vh"
              height="2vh"
              borderRadius="7px"
            ></Tile>
            <Tile
              bgColor="#D9D9D9"
              shadow="0 0 5px #D9D9D9"
              width="6vh"
              height="2vh"
              borderRadius="7px"
            ></Tile>
          </div>
        </div>
        <div id="Right">
          <p id="WelcomeBack">WE ARE SO EXCITED TO SEE YOU AGAIN!</p>
          <p id="Register">
            FIRST TIME HERE?
            <br />
            CLICK{" "}
            <Link to={`Register`} className="LoginPanelLinks">
              HERE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
