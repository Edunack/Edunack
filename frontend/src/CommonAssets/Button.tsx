import "./Button.css";

interface Props {
  children: string;
  bgColor: string;
  color?: string;
  fontSize?: string;
  fontWeight: number;
  zIndex?: number;
  width?: string;
  padding?: string;
  borderRadius?: string;
  margin?: string;
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
        }}
        id="customBtn"
      >
        {children}
      </button>
    </>
  );
}

export default Button;
