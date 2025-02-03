import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Input from "../CommonAssets/Input";
import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import { useState, useContext } from "react";
import { MagnificationContext } from "../main";

function Login() {
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyMagnification = {
    height: `${
      magnificationLevel > 1 ? (magnificationLevel > 1.25 ? 80 : 77.5) : 75
    }vh`,
  };

  const applyMagnificationLeft = {
    gap: `${
      magnificationLevel > 1 ? (magnificationLevel > 1.25 ? 1.5 : 1.75) : 2
    }vh`,
  };

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    fetch("/api/auth/login", {
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
    <div id="login">
      <div id="mobileLoginPanel">
        <div id="mobileLoginTitle">
          <span>
            <span style={{ fontSize: "200%" }}>LOG IN</span>
            <br />
            WE ARE SO EXCITED
            <br />
            TO SEE YOU AGAIN!
          </span>
          <img src="/img/logo.svg" alt="app logo" />
        </div>
        <form id="mobileForm" onSubmit={handleSubmit}>
          <Input
            hint="EMAIL"
            type="text"
            name="login"
            width="85vw"
            margin="0"
            padding="1.5vh 1vh"
          />
          <Input
            hint="PASSWORD"
            type="password"
            name="password"
            width="85vw"
            margin="0"
            padding="1.5vh 1vh"
          />
          <p
            id="mobileLoginResponse"
            style={{ display: response !== "" ? "block" : "none" }}
          >
            {response}
          </p>
          <Button
            bgColor="#90299C"
            color="white"
            fontWeight={700}
            width="90vw"
            margin="0"
            padding="1.5vh 1vh"
            borderRadius="10px"
            type="submit"
          >
            LOG IN
          </Button>
        </form>
        <span id="mobileRegisterRedirect">
          If you do not have an account, click{" "}
          <Link to={`/Register`} className="loginPanelLinks">
            here
          </Link>{" "}
          to create one
        </span>
      </div>

      <div id="loginPanel" style={applyMagnification}>
        <div id="left" style={applyMagnificationLeft}>
          <div id="mainText">
            <p id="loginText">LOG IN</p>
            <span id="loginSubtext">
              If you do not have an account, click{" "}
              <Link to={`/Register`} className="loginPanelLinks">
                here
              </Link>{" "}
              to create one
            </span>
          </div>
          <form id="form" onSubmit={handleSubmit}>
            <Input label="EMAIL" type="text" name="login" />
            <Input
              label="PASSWORD"
              type="password"
              name="password"
              margin="2% 0 1.5vh 0"
            />
            <p id="loginResponse">{response}</p>
            <Button
              bgColor="#90299C"
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
          <div id="alternateLoginText">
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
          <div id="alternateLoginMethods">
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
        <div id="right">
          <p id="welcomeBack">WE ARE SO EXCITED TO SEE YOU AGAIN!</p>
          <p id="registerText">
            FIRST TIME HERE?
            <br />
            CLICK{" "}
            <Link to={`/Register`} className="loginPanelLinks">
              HERE
            </Link>
          </p>
          <img src="../../img/logo.svg" alt="" id="logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;
