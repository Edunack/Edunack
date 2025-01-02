import "./Input.css";

interface Props {
  label?: string;
  type: string;
  bgColor?: string;
  color?: string;
  margin?: string;
  padding?: string;
  name?: string;
  hint?: string;
  width?: string;
  height?: string;
}

function Input({
  label,
  type,
  bgColor = "#D9D9D9",
  color = "#202020",
  margin,
  padding,
  name,
  hint,
  width,
  height,
}: Props) {
  return (
    <div style={{ textAlign: "left" }}>
      <label htmlFor={label} id="InputLabel">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={hint}
        style={{
          backgroundColor: bgColor,
          color: color,
          margin: margin,
          padding: padding,
          width: width,
          height: height,
        }}
        className="CustomInput"
      />
    </div>
  );
}

export default Input;
