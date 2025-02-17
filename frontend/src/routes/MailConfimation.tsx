import Button from "../CommonAssets/Button";
import "./MailConfirmation.css";

function MailConfirmation() {
  return (
    <div id="mailConfirmation">
      <div id="mailConfirmationPanel">
        <p>Thank you for joining us</p>
        <p>Please click this button to activate your account</p>
        <svg
          width="26"
          height="44"
          viewBox="0 0 13 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="6.28906" x2="6.28906" y2="12.1579" stroke="#90429C" />
          <line
            x1="0.353553"
            y1="15.2778"
            x2="6.72197"
            y2="21.6462"
            stroke="#90429C"
          />
          <line
            y1="-0.5"
            x2="9.00631"
            y2="-0.5"
            transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.7363 15.6313)"
            stroke="#90429C"
          />
        </svg>

        <Button
          bgColor="#90299C"
          width="20vw"
          height="8vh"
          padding="1vh 1vh"
          borderRadius="1vh"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default MailConfirmation;
