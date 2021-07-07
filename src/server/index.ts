import express from "express";
const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, access_token"
  );
  next();
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.json(["こんちゃー", "こんばんわー"]);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export {};
