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
}

function Tile({
  children,
  bgColor,
  color,
  shadow,
  width,
  height,
  borderRadius,
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
      }}
      id="tile"
    >
      {children}
    </div>
  );
}

export default Tile;
