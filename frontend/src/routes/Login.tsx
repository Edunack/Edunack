import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Input from "../CommonAssets/Input";
import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import { useState } from "react";

function Login() {
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((data) => {
      console.log(data);
      if (data.status === 401) {
        setResponse("Incorrect login or password");
      } else if (data.status === 500) {
        setResponse("Internal server error");
      } else if (data.status === 200) {
        setResponse("");
        data.json().then((data) => {
          console.log(data);
          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("userId", data.id);
        });
        navigate("/", { replace: true });
      }
    });
  }

  return (
    <div id="Login">
      <div id="LoginPanel">
        <div id="Left">
          <div id="MainText">
            <p id="LoginText">LOG IN</p>
            <span id="LoginSubtext">
              If you do not have an account, click{" "}
              <Link to={`/Register`} className="LoginPanelLinks">
                here
              </Link>
              to create one
            </span>
          </div>
          <form id="Form" onSubmit={handleSubmit}>
            <Input label="EMAIL" type="text" name="login" />
            <Input
              label="PASSWORD"
              type="password"
              name="password"
              margin="2% 0 1.5vh 0"
            />
            <p id="LoginResponse">{response}</p>
            <Button
              bgColor="#90429C"
              color="white"
              fontWeight={700}
              width="100%"
              padding="3%"
              borderRadius="10px"
              margin="1.5vh 0 2vh 0 "
              type="submit"
            >
              LOG IN
            </Button>
          </form>
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
          <p id="RegisterText">
            FIRST TIME HERE?
            <br />
            CLICK{" "}
            <Link to={`/Register`} className="LoginPanelLinks">
              HERE
            </Link>
          </p>
          <img src="../../img/logo.svg" alt="" id="Logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;
