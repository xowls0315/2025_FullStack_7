// 리터럴 타입(Literal Types)
const pizza1: "치즈피자" | "새우피자" = "치즈피자";

// 서브웨이
// {bread: 플랫,파마산,오레가노,오트}
// {cheese: 슈레드,모짜렐라,아메리칸}
// {topping: 고기,새우,오믈렛,아보카도,에그마요}
// {vegetable: 양상추,토마토,오이,파프리카,할라피뇨,피클}
// {source: 렌치,스위트칠릿,핫칠리,바베큐,후추,올리브오일}

// type Bread = "플랫" | "파마산" | "오레가노" | "오트";
// type Cheese = "슈레드" | "모짜렐라" | "아메리칸";
// type Topping = ("고기" | "새우" | "오믈렛" | "아보카도" | "에그마요")[];
// type Vegetable = ("양상추" | "토마토" | "오이" | "파프리카" | "할라피뇨")[];
// type Source = (
//   | "렌치"
//   | "스위트칠릿"
//   | "핫칠리"
//   | "바베큐"
//   | "후추"
//   | "올리브오일"
// )[];
// type Subway = {
//   bread: Bread;
//   cheese: Cheese;
//   topping: Topping;
//   vegetable: Vegetable;
//   source: Source;
// };

const subway1: Subway = {
  bread: "파마산",
  cheese: "모짜렐라",
  topping: ["오믈렛", "고기"],
  vegetable: ["토마토", "양상추"],
  source: ["바베큐", "스위트칠릿"],
};
