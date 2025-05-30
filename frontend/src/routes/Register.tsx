import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import Input from "../CommonAssets/Input";
import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import { useState, useContext } from "react";
import { MagnificationContext } from "../main";

function Register() {
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyMagnification = {
    height: `${
      magnificationLevel > 1 ? (magnificationLevel > 1.25 ? 87.5 : 82.5) : 80
    }vh`,
    width: `${
      magnificationLevel > 1 ? (magnificationLevel > 1.25 ? 140 : 135) : 130
    }vh`,
  };

  const applyMagnificationRight = {
    gap: `${
      magnificationLevel > 1 ? (magnificationLevel > 1.25 ? 0.75 : 1.75) : 2
    }vh`,
  };

  const applyMagnificationImg = {
    bottom: `${magnificationLevel > 1.25 ? -0.5 : -2}%`,
  };

  const applyMobile = {
    clipPath: `${
      magnificationLevel > 1.25
        ? "polygon(0 25%, 100% 0, 100% 75%, 0 100%)"
        : "polygon(0% 30%, 100% 0%, 100% 70%, 0 100%)"
    }`,
  };

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const password = data["password"];
    const repeatedPassword = data["repeatPassword"];

    const email = data["email"] as string;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!emailRegex.test(email)) {
      setResponse("Email is not valid");
      console.log("invalid email");
      return;
    }

    if (password !== repeatedPassword) {
      setResponse("Passwords do not match");
      return;
    }

    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (data) => {
        return { status: data.status, body: await data.text() };
      })
      .then((data) => {
        console.log(data);
        if (data.status == 400 && data.body == "Username") {
          setResponse("Username already taken");
        } else if (data.status == 400 && data.body == "Email") {
          setResponse("Email already taken");
        } else if (data.status == 201) {
          setResponse("");
          navigate("/Login", { replace: true });
        }
      });
  }

  return (
    <div id="register">
      <div id="mobileRegisterPanel" style={applyMobile}>
        <div id="mobileRegisterTitle">
          <img src="/img/logo.svg" alt="app logo" />
          <span>
            <span style={{ fontSize: "200%" }}>SIGN UP</span>
            <br />
            WE ARE SO EXCITED
            <br />
            TO HAVE YOU!
          </span>
        </div>
        <form id="mobileForm" onSubmit={handleSubmit}>
          <Input
            hint="NAME"
            type="text"
            name="username"
            width="85vw"
            margin="0"
            padding="1.5vh 1vh"
          />
          <Input
            hint="EMAIL"
            type="text"
            name="email"
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
          <Input
            hint="REPEAT PASSWORD"
            type="password"
            name="repeatPassword"
            width="85vw"
            margin="0"
            padding="1.5vh 1vh"
          />
          <p
            id="mobileRegisterResponse"
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
            SIGN UP
          </Button>
        </form>
        <span id="mobileLoginRedirect">
          If you already have an account, click{" "}
          <Link to={`/Login`} className="registerPanelLinks">
            here
          </Link>{" "}
          to log in
        </span>
      </div>

      <div id="registerPanel" style={applyMagnification}>
        <div id="left">
          <p id="welcome">WE ARE SO EXCITED TO HAVE YOU!</p>
          <p id="loginText">
            ALREADY HAVE AN ACCOUNT
            <br />
            CLICK{" "}
            <Link to={`/Login`} className="registerPanelLinks">
              HERE
            </Link>
          </p>
          <img
            src="../../img/logo.svg"
            alt=""
            id="logo"
            style={applyMagnificationImg}
          />
        </div>
        <div id="right" style={applyMagnificationRight}>
          <div id="registerText">
            <p id="mainText">SIGN UP</p>
            <span id="registerSubtext">
              If you already have an account, click{" "}
              <Link to={`/Login`} className="registerPanelLinks">
                here
              </Link>{" "}
              to log in
            </span>
          </div>
          <form id="form" onSubmit={handleSubmit}>
            <Input label="NAME" type="text" name="username" padding="1.5vh" />
            <Input label="EMAIL" type="text" name="email" padding="1.5vh" />
            <Input
              label="PASSWORD"
              type="password"
              name="password"
              padding="1.5vh"
            />
            <Input
              label="REPEAT PASSWORD"
              type="password"
              name="repeatPassword"
              padding="1.5vh"
            />
            <p id="registerResponse">{response}</p>
            <Button
              type="submit"
              bgColor="#90299C"
              color="white"
              fontWeight={700}
              width="80%"
              padding="3%"
              borderRadius="10px"
              alignSelf="center"
              margin="4.5vh 0 0 0"
            >
              SIGN UP
            </Button>
          </form>
          <div id="alternateRegisterText">
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
          <div id="alternateRegisterMethods">
            <Tile
              bgColor="#D9D9D9"
              shadow="0 0 5px #D9D9D9"
              width="10%"
              height="2%"
              borderRadius="7px"
              margin="0"
              padding="3.5vh"
            ></Tile>
            <Tile
              bgColor="#D9D9D9"
              shadow="0 0 5px #D9D9D9"
              width="10%"
              height="2%"
              borderRadius="7px"
              margin="0"
              padding="3.5vh"
            ></Tile>
            <Tile
              bgColor="#D9D9D9"
              shadow="0 0 5px #D9D9D9"
              width="10%"
              height="2%"
              borderRadius="7px"
              margin="0"
              padding="3.5vh"
            ></Tile>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
