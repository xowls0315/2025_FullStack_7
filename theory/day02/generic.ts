// generic - 타입의 변수

type Movie<T> = {
  name: string;
  genre: string[];
  director: T;
  runningTime: number;
};

const zootopia: Movie<string[]> = {
  name: "주토피아2",
  genre: ["애니메이션", "판타지", "범죄/스릴"],
  director: ["부시", "하워드"],
  runningTime: 108,
};

// Response<T>
type ApiResponse<T> = {
  code: 200 | 201 | 202 | 400 | 401 | 402;
  type: string;
  message: string;
  data: T;
};
type Category = {
  id: number;
  name: string;
};
type Tag = {
  id: number;
  name: string;
};
type Pet = {
  id: number;
  category: Category;
  name: string;
  photoUrls: string[];
  tag: Tag;
  status: "available" | "pending" | "sold";
};

const test1: ApiResponse<Pet> = {
  code: 200,
  type: "GET",
  message: "강아지 잘키우셈",
  data: {
    id: 100,
    name: "개복이",
    photoUrls: ["사진.jpg"],
    category: {
      id: 1,
      name: "말랑개",
    },
    status: "available",
    tag: {
      id: 1,
      name: "쀼쀼",
    },
  },
};

// main은 아침이면 맥모닝 메뉴들이 나오고
// 아침이 아니면 원래 메뉴들 나오도록 타입 만들기!
type MorningMain = "치즈 머핀" | "에그 머핀" | "소세지 머핀";
type MorningSide = "해시 브라운" | "애플 파이" | "핫 케이크" | "스트링 치즈";
type NormalMain = "빅맥" | "상하이" | "불고기";
type NormalSide =
  | "감자 튀김"
  | "치즈 스틱"
  | "토네이도"
  | "맥너겟"
  | "코우슬로"
  | "맥윙";

type Main = MorningMain | NormalMain;
type Side = MorningSide | NormalSide;

type MatchingSide<T> = T extends MorningMain
  ? MorningSide
  : T extends NormalMain
  ? NormalSide
  : never;

const sanghi: Macdonald<NormalMain> = {
  main: "상하이",
  side: "맥너겟",
  beverage: "콜라",
};
const ham: Macdonald<MorningMain> = {
  main: "에그 머핀",
  side: "핫 케이크",
  beverage: "아메리카노",
};

// extends는 제약화
type Macdonald<T extends Main> = {
  main: T;
  side: MatchingSide<T>;
  beverage: string;
};

// const Muffin: Macdonald<MorningMain, MorningSide> = {
//   main: "에그 머핀",
//   side: "해시 브라운",
//   beverage: "주스",
// };

// const lunch: Macdonald<NormalMain, NormalSide> = {
//   main: "빅맥",
//   side: "감자 튀김",
//   beverage: "콜라",
// };

// 조건부 타입
type KoreanFood<T> = T extends "뜨거움" ? "뜨거운 음식" : "차가운 음식";
const ricecake: KoreanFood<"차가움"> = "차가운 음식";
const udon: KoreanFood<"뜨거움"> = "뜨거운 음식";

type Japan<T> = T extends "도쿄" ? "수도" : "비수도";
const osaka: Japan<"오사카"> = "비수도";

type Food<T> = T extends "메인"
  ? { main: string; price: number }
  : { sub: string; price: number };
const origogi: Food<"메인"> = { main: "오리고기", price: 5000 };
const enchovy: Food<"사이드"> = { sub: "멸치볶음", price: 2000 };
