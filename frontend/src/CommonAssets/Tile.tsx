import { ReactNode } from "react";
import "./Tile.css";

interface Props {
  children?: ReactNode;
  bgColor: string;
  color?: string;
  shadow?: string;
  width?: string;
  height?: string;
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
  borderRadius,
  margin,
  padding,
}: Props) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: color,
        boxShadow: shadow,
        height: height,
        width: width,
        borderRadius: borderRadius,
        margin: margin,
        padding: padding,
      }}
      id="tile"
    >
      {children}
    </div>
  );
}

export default Tile;
