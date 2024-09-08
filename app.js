import express from "express";
import connect from "./schemas/index.js";
import TodosRouter from "./routes/todos.router.js";

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
// app.use 는 미들웨어를 사용하게 해주는 코드예요! 맨 처음 인자 값에 들어간 /api 에 의해서
// http://127.0.0.1:8080/api 경로로 접근하는 경우에만 json 미들웨어를 거친 뒤, router로 연결되도록 하는것
app.use(express.json());
// express.json 미들웨어는 클라이언트의 요청(Request)을 받을때
//  body에 있는 데이터를 정상적으로 사용할 수 있게 분석해주는 역할을 해요!
// 그로인해, 우리는 지금 JSON 형태의 body를 입력받을 수 있게 된것
app.use(express.urlencoded({ extended: true }));

// static Middleware, express.static()을 사용하여 정적 파일을 제공합니다.
// express.static() 함수는app.js 파일 기준으로,
// 입력 값(지금은 "./assets") 경로에 있는 파일을 아무런 가공 없이 그대로 전달해주는 미들웨어
app.use(express.static("./assets"));

// 라우터를 이용하여 해당 라우터 구성
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

// /api 주소로 접근하였을 때, router와 TodosRouter로 클라이언트의 요청이 전달됩니다.
app.use("/api", [router, TodosRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
