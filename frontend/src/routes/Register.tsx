import "./Register.css";
import { Link } from "react-router-dom";
import Input from "../CommonAssets/Input";
import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import { useState } from "react";

function Register() {
  const [response, setResponse] = useState("");

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
      if (data.status == 400 && data.statusText == "Username already exists") {
        setResponse(data.statusText);
      } else if (
        data.status == 400 &&
        data.statusText == "Email already exists"
      ) {
        setResponse(data.statusText);
      } else if (data.status == 200) {
        setResponse("");
      }
    });
  }

  return (
    <div id="Register">
      <div id="RegisterPanel">
        <div id="Left">
          <p id="Welcome">WE ARE SO EXCITED TO HAVE YOU!</p>
          <p id="LoginText">
            ALREADY HAVE AN ACCOUNT
            <br />
            CLICK{" "}
            <Link to={`/Login`} className="RegisterPanelLinks">
              HERE
            </Link>
          </p>
          <img src="../../img/logo.svg" alt="" id="Logo" />
        </div>
        <div id="Right">
          <div id="RegisterText">
            <p id="MainText">SIGN UP</p>
            <span id="RegisterSubtext">
              If you already have an account, click{" "}
              <Link to={`/Login`} className="RegisterPanelLinks">
                here
              </Link>{" "}
              to create one
            </span>
          </div>
          <form id="Form" onSubmit={handleSubmit}>
            <Input label="NAME" type="text" name="username" padding="1.5vh" />
            <Input label="EMAIL" type="text" name="email" padding="1.5vh" />
            <Input
              label="PASSWORD"
              type="password"
              name="password"
              padding="1.5vh"
            />
            <Input label="REPEAT PASSWORD" type="password" padding="1.5vh" />
            <p id="RegisterResponse">{response}</p>
            <Button
              type="submit"
              bgColor="#90429C"
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
          <div id="AlternateRegisterText">
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
          <div id="AlternateRegisterMethods">
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
