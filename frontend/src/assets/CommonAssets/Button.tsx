import "./Button.css";

interface Props {
  children: string;
  bgColor: string;
  color: string;
  fontSize: string;
  fontWeight: number;
  zIndex: number;
}

function Button({
  children,
  bgColor,
  color,
  fontSize,
  fontWeight,
  zIndex,
}: Props) {
  return (
    <>
      <button
        style={{
          color: color,
          backgroundColor: bgColor,
          fontSize: fontSize,
          fontWeight: fontWeight,
          zIndex: zIndex,
        }}
        id="customBtn"
      >
        {children}
      </button>
    </>
  );
}

export default Button;
