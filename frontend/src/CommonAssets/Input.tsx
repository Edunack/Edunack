import "./Input.css";

interface Props {
  label: string;
  type: string;
  bgColor?: string;
  color?: string;
  margin?: string;
  padding?: string;
  name?: string;
}

function Input({
  label,
  type,
  bgColor = "#D9D9D9",
  color = "#202020",
  margin,
  padding,
  name,
}: Props) {
  return (
    <div style={{ textAlign: "left" }}>
      <label htmlFor={label} id="InputLabel">
        {label}
      </label>
      <input
        type={type}
        name={name}
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
