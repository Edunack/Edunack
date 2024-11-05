import "./Button.css";

interface Props {
  children: string;
  bgColor: string;
  color?: string;
  fontSize?: string;
  fontWeight?: number;
  zIndex?: number;
  width?: string;
  padding?: string;
  borderRadius?: string;
  margin?: string;
  alignSelf?: string;
  type?: "button" | "submit" | "reset";
}

function Button({
  children,
  bgColor,
  color = "white",
  fontSize,
  fontWeight,
  zIndex = 0,
  width = "",
  borderRadius,
  padding,
  margin,
  type,
  alignSelf,
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
          width: width,
          padding: padding,
          borderRadius: borderRadius,
          margin: margin,
          alignSelf: alignSelf,
        }}
        type={type}
        id="customBtn"
      >
        {children}
      </button>
    </>
  );
}

export default Button;
