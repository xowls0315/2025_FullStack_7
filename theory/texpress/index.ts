import express, { Request } from "express";

const app = express();

app.get("/", (req, res) => {
  const { name, age } = req.query;
  res.json({ name, age });
});

app.get("/user/:id", (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  res.json({ id });
});

app.get("/coffee/:id", (req: Request<{ id: string }, {}, {}, { size?: string; shots?: string }>, res) => {
  const { size, shots } = req.query;
  res.json({ msg: `주문하신 size:${size} 나옴 ㅅㄱ` });
});

app.post("/coffee", (req: Request<{}, {}, { name: string; price: number; shots: 1 | 2 | 3 | 4 | 5 }>, res) => {
  const { name, price, shots } = req.body;
});

app.listen(3000, () => {
  console.log("서버 시작~!");
});
