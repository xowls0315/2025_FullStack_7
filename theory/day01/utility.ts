type Lunch = "고구마모찌빵" | "두바이모찌빵" | "에그타르트" | "국밥" | "도시락";

type Teto = Extract<Lunch, "국밥" | "도시락">;
type AromBake = Exclude<Lunch, Teto>;

type 짱구인물 =
  | "짱구"
  | "짱아"
  | "봉미선"
  | "신형만"
  | "철수"
  | "맹구"
  | "훈발"
  | "유리"
  | "채성아"
  | "나미리"
  | "이슬이 누나";
type 짱구가족 = Extract<짱구인물, "짱구" | "짱아" | "봉미선" | "신형만">;
type 떡잎방범대 = Extract<짱구인물, "짱구" | "철수" | "맹구" | "훈발" | "유리">;

type A = Exclude<짱구가족, Extract<짱구가족, 떡잎방범대>>;
type B = Exclude<떡잎방범대, Extract<짱구가족, 떡잎방범대>>;
type 비주요인물 = A | B;

// Pick, Omit
type Bread = { bread: "플랫" | "파마산" | "오레가노" | "오트" };
type Cheese = { cheese: "슈레드" | "모짜렐라" | "아메리칸" };
type Topping = {
  topping: ("고기" | "새우" | "오믈렛" | "아보카도" | "에그마요")[];
};
type Vegetable = {
  vegetable: ("양상추" | "토마토" | "오이" | "파프리카" | "할라피뇨")[];
};
type Source = {
  source: (
    | "렌치"
    | "스위트칠릿"
    | "핫칠리"
    | "바베큐"
    | "후추"
    | "올리브오일"
  )[];
};
type Subway = Bread & Cheese & Topping & Vegetable & Source;

type Student1 = {
  name: string;
  age: number;
  major: string;
};
type Test = Pick<Student1, "name" | "age">;
type Test1 = Omit<Student1, "major">;
type WithoutSource = Omit<Subway, "source">;
type Submorning = Omit<Subway, "vegetable">;
