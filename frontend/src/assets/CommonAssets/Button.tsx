import "./Button.css";

interface Props {
  children: string;
  bgColor: string;
  color: string;
  fontSize: string;
  fontWeight: number;
}

function Button({ children, bgColor, color, fontSize, fontWeight }: Props) {
  return (
    <>
      <button
        style={{
          color: color,
          backgroundColor: bgColor,
          fontSize: fontSize,
          fontWeight: fontWeight,
        }}
        id="customBtn"
      >
        {children}
      </button>
    </>
  );
}

export default Button;
