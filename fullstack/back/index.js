import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// endpoint

// 짜장면: 0[GET, POST]
// 탕수육: 0[GET, POST]
// 만두: 0[GET, POST]

// GET은 먹은 음식의 갯수를 알려주는 기능
// POST는 해당 음식의 먹은 갯수를 +1 해주는 기능

let jajangCount = 0; // 짜장면 먹은 갯수
let tangsuCount = 0; // 탕수육 먹은 갯수
let manduCount = 0; // 만두 먹은 갯수

// 1) 짜장면
// GET /jajangmyeon : 지금까지 먹은 짜장면 갯수 조회
app.get("/jajangmyeon", (req, res) => {
  res.json({
    menu: "짜장면",
    count: jajangCount,
    message: `지금까지 짜장면을 ${jajangCount}그릇 먹었습니다.`,
  });
});
// POST /jajangmyeon : 짜장면 갯수 +1
app.post("/jajangmyeon", (req, res) => {
  jajangCount += 1;

  res.json({
    menu: "짜장면",
    count: jajangCount,
    message: `짜장면을 1그릇 더 먹었습니다! (총 ${jajangCount}그릇)`,
  });
});

// 2) 탕수육
// GET /tangsuyuk : 지금까지 먹은 탕수육 갯수 조회
app.get("/tangsuyuk", (req, res) => {
  res.json({
    menu: "탕수육",
    count: tangsuCount,
    message: `지금까지 탕수육을 ${tangsuCount}번 먹었습니다.`,
  });
});
// POST /tangsuyuk : 탕수육 갯수 +1
app.post("/tangsuyuk", (req, res) => {
  tangsuCount += 1;

  res.json({
    menu: "탕수육",
    count: tangsuCount,
    message: `탕수육을 1번 더 먹었습니다! (총 ${tangsuCount}번)`,
  });
});

// 3) 만두
// GET /mandu : 지금까지 먹은 만두 갯수 조회
app.get("/mandu", (req, res) => {
  res.json({
    menu: "만두",
    count: manduCount,
    message: `지금까지 만두를 ${manduCount}개 먹었습니다.`,
  });
});
// POST /mandu : 만두 갯수 +1
app.post("/mandu", (req, res) => {
  manduCount += 1;

  res.json({
    menu: "만두",
    count: manduCount,
    message: `만두를 1개 더 먹었습니다! (총 ${manduCount}개)`,
  });
});

app.get("/", (req, res) => {
  res.json("API Test!!");
});

app.listen(3000, () => {
  console.log("중국집 서버 시작~!");
});
