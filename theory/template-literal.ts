type Size = "Small" | "Medium" | "Large";
type Concept = "Potato" | "Sweet-Potato" | "Cream" | "Hot Chicken";
type Pizza = `${Size}-${Concept}-Pizza`;

const domino: Pizza = "Large-Cream-Pizza";

const makePizza = (pizza: Pizza) => {
  if (pizza === "Large-Hot Chicken-Pizza")
    console.log("매운 치킨 피자 주문 완료!");
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type EndPoint = "Posts" | "Comments" | "Users";
type API = `api/${EndPoint}`;
const test: API = "api/Comments";

type Students = `javascript-${string}`;
const student1: Students = "javascript-황태진";
