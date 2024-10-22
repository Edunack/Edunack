import { ReactNode } from "react";
import "./Tile.css";

interface Props {
  children: ReactNode;
  bgColor: string;
  color: string;
  shadow: string;
}

function Tile({ children, bgColor, color, shadow }: Props) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: color,
        boxShadow: `0 0 57px ${shadow}`,
      }}
      id="tile"
    >
      {children}
    </div>
  );
}

export default Tile;
