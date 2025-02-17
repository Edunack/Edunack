import "./PasswordChange.css";
import Button from "../CommonAssets/Button";

function PasswordChange() {
  return (
    <div id="passwordChange">
      <div id="passwordChangePanel">
        <form>
          <label className="passwordLabels">Old Password</label>
          <input className="passwordInputs" type="password" />
          <label className="passwordLabels">New Password</label>
          <input className="passwordInputs" type="password" />
          <label className="passwordLabels">Repeat New Password</label>
          <input className="passwordInputs" type="password" />
          <Button
            bgColor="#90299C"
            width="18vw"
            height="8vh"
            padding="1vh 1vh"
            borderRadius="1vh"
            type="submit"
            margin="2vh 0 0 0"
          >
            Confirm
          </Button>
        </form>
      </div>
    </div>
  );
}

export default PasswordChange;
