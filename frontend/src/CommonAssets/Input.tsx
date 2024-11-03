import "./Input.css";

interface Props {
  label: string;
  type: string;
  bgColor?: string;
  color?: string;
  margin?: string;
  padding?: string;
}

function Input({
  label,
  type,
  bgColor = "#D9D9D9",
  color = "#202020",
  margin,
  padding,
}: Props) {
  return (
    <div style={{ textAlign: "left" }}>
      <label htmlFor={label} id="InputLabel">
        {label}
      </label>
      <input
        type={type}
        style={{
          backgroundColor: bgColor,
          color: color,
          margin: margin,
          padding: padding,
        }}
        id="CustomInput"
      />
    </div>
  );
}

export default Input;
