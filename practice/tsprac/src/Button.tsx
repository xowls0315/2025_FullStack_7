export type ButtonProps = {
  text: string;
  color: "black" | "gray";
  backgroundColor: "#1AD4C5" | "#BBBABA" | "#FF9093";
};

const Button = (props: ButtonProps) => {
  return <button style={{ ...props }}>{props.text}</button>;
};

export default Button;
