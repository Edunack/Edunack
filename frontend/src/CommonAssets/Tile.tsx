import { ReactNode } from "react";
import { MagnificationContext } from "../main";
import { useContext } from "react";
import "./Tile.css";

interface Props {
  children?: ReactNode;
  bgColor: string;
  color?: string;
  shadow?: string;
  width: string;
  height: string;
  border?: string;
  borderRadius?: string;
  margin?: string;
  padding?: string;
}

function Tile({
  children,
  bgColor,
  color,
  shadow,
  width,
  height,
  border,
  borderRadius,
  margin,
  padding,
}: Props) {
  const { magnificationLevel } = useContext(MagnificationContext);

  const heightValue = parseFloat(height.replace(/[^0-9.-]+/g, ""));
  const widthValue = parseFloat(width.replace(/[^0-9.-]+/g, ""));

  console.log(heightValue, widthValue, magnificationLevel);

  const applyMagnification = {
    height: `${heightValue * magnificationLevel}${height.replace(
      /[0-9.-]+/g,
      ""
    )}`,
    width: `${widthValue * magnificationLevel}${width.replace(
      /[0-9.-]+/g,
      ""
    )}`,
    backgroundColor: bgColor,
    color: color,
    boxShadow: shadow,
    borderRadius: borderRadius,
    margin: margin,
    padding: padding,
    border: border,
  };

  return (
    <div style={applyMagnification} id="tile">
      {children}
    </div>
  );
}

export default Tile;
