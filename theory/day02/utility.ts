type Oozy = {
  name: string;
  price: number;
  shots?: number; // optional
};
const coffee1: Oozy = { name: "라떼", price: 3000 };

// Partial은 모두 옵셔널
type Uuzy = Partial<Oozy>;

// Required은 모두 필수
type Iizy = Required<Oozy>;

// Pick은 특정 키만 선택
type Kizy = Pick<Oozy, "name" | "price">;

// Omit은 특정 키만 빼고
type Bizy = Omit<Oozy, "shots">;

type Qizy1 = Partial<Kizy>; // {name?: string, price?: number}

type M1 = "E" | "I";
type B1 = "S" | "N";
type T1 = "T" | "F";
type I1 = "P" | "J";
type MBTI = `${M1}${B1}${T1}${I1}`;

type Psycho = Extract<MBTI, "ESTJ">;
type NotPsycho = Exclude<MBTI, "ESTJ">;

type Test11 = Record<"name" | "nickname", string>;
type Test12 = Record<"age" | "height", number>;
type Students1 = { name: string; age: number };
type OurClass = Partial<Record<MBTI, Students1[]>>;
type Z = Record<"name", string> | Record<"age", number>;

const test: Z = {
  age: 21,
  name: "김이박",
};

const cicd: OurClass = {
  INFP: [
    { name: "손정우", age: 27 },
    { name: "이영철", age: 27 },
  ],
  INFJ: [{ name: "신여진", age: 30 }],
  ISTP: [{ name: "전상원", age: 28 }],
};
