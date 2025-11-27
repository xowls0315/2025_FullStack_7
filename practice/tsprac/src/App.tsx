import Button, { type ButtonProps } from "./Button";
import type { HeadingProps } from "./Heading";
import Heading from "./Heading";
function App() {
  const buttonList: ButtonProps[] = [
    { text: "첫번째 버튼", color: "black", backgroundColor: "#1AD4C5" },
    { text: "두번째 버튼", color: "gray", backgroundColor: "#BBBABA" },
    { text: "세번째 버튼", color: "black", backgroundColor: "#FF9093" },
  ];

  const textList: HeadingProps[] = [
    { text: "Heading1", fontSize: "60px", color: "black" },
    { text: "Heading2", fontSize: "48px", color: "black" },
    { text: "Heading3", fontSize: "40px", color: "black" },
    { text: "Subtitle1", fontSize: "28px", color: "black" },
    { text: "Subtitle2", fontSize: "18px", color: "black" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {textList.map((v) => (
        <Heading {...v} />
      ))}
    </div>
  );
}

export default App;
