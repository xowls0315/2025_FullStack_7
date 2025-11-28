// | => union type

const b1: string | number = "1";
const b2: number | boolean = !!1;

const lunchBox: { main: string; subs: string[]; dessert: null | string }[] = [
  { main: "오리고기", subs: ["1", "2"], dessert: null },
];

// & => intersection type
// const c1: string & number;
const c2: { name: string } & { age: number } & { isMale: boolean } = {
  name: "태진",
  age: 25,
  isMale: true,
};
