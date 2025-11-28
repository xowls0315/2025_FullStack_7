const age: number = 25;
const name1: string = "Chris";
const isMan: boolean = true;
const coffee: { name: string; price: number; shots: number } = {
  name: "아메리카노",
  price: 2000,
  shots: 2,
};

// pizza {name, price, hasPepperoni}
const pizza: { name: string; price: number; hasPepperoni: boolean } = {
  name: "페퍼로니 피자",
  price: 15000,
  hasPepperoni: true,
};

const nums: number[] = [1, 2, 3, 4, 5];

// lunchboxes
// {main, subs, desserts}

const lunchboxes: { main: string; subs: string[]; desserts: string[] }[] = [
  {
    main: "돈까스",
    subs: ["샐러드", "스프"],
    desserts: ["과일", "푸딩"],
  },
  {
    main: "국밥",
    subs: ["김치", "계란찜"],
    desserts: ["식혜", "과일"],
  },
];
