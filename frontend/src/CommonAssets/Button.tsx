import "./Button.css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  bgColor: string;
  color?: string;
  fontSize?: string;
  fontWeight?: number;
  zIndex?: number;
  width?: string;
  height?: string;
  padding?: string;
  border?: string;
  borderBottom?: string;
  borderRadius?: string;
  margin?: string;
  alignSelf?: string;
  boxShadow?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

function Button({
  children,
  bgColor,
  color = "white",
  fontSize,
  fontWeight,
  zIndex = 0,
  width = "",
  height = "",
  border,
  borderBottom,
  borderRadius,
  padding,
  margin,
  type,
  alignSelf,
  onClick,
  boxShadow,
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
          height: height,
          padding: padding,
          borderRadius: borderRadius,
          margin: margin,
          alignSelf: alignSelf,
          border: border,
          borderBottom: borderBottom,
          boxShadow: boxShadow,
        }}
        type={type}
        id="customBtn"
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
