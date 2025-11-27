import type { HeadingSize } from "./util/css";

export type HeadingProps = {
  fontSize: `${HeadingSize}px`;
  text: string;
  color: string;
};

const Heading = ({ fontSize, text, color }: HeadingProps) => {
  return <strong style={{ fontSize, color }}>{text}</strong>;
};

export default Heading;
