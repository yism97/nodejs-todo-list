// /routes/todos.router.js

import express from "express";
import Todo from "../schemas/todo.schema.js";

const router = express.Router();
/* 할일 등록 API */
// 해당하는 데이터 조회를 위해 async, await 사용
router.post("/todos", async (req, res, next) => {
  // 1. 클라이언트로 부터 받아온 value 데이터를 가져온다.
  const { value } = req.body;

  // 1.5 만약, 클라이언트가 Value 데이터를 전달하지 않았을 때, 클라이언트에게 에러 메시지를 전달한다.
  if (!value) {
    return res
      .status(400)
      .json({ errorMessage: "해야할 일(value) 데이터가 존재하지 않습니다." });
  }

  // 2. 해당하는 마지막 order 데이터를 조회한다.
  // Todo 스키마에있는 몽구스 모델
  // findOne 은 1개의 데이터만 조회
  // sort 는 정렬한다 -> order라는 컬럼을
  // 데이터 조회시 exec() 필수
  const todomaxorder = await Todo.findOne().sort("-order").exec(); // order 앞에 -붙이면 내림차순

  // 3. 만약 존재한다면 현재 해야 할 일을 +1 하고, order 데이터가 존재하지 않다면, 1로 할당.
  const order = todomaxorder ? todomaxorder.order + 1 : 1;
  // 4. 해야 할 일 등록
  const todo = new Todo({ value, order }); // new 는 하나의 데이터를 생성할 수 있다.
  await todo.save();
  // 5. 해야 할 일을 클라이언트에게 반환

  return res.status(201).json({ todo });
});

/* 해야 할 일 목록 조회 API */
// next 는 굳이 안붙여도됨 나중에 리팩토링을 위한 요소
router.get("/todos", async (req, res, next) => {
  // 1. 해야할 일 목록 조회를 진행
  const todos = await Todo.find().sort("-order").exec();

  // 2. 해야할 일 목록 조히 결과를 클라이언트에게 반환
  return res.status(200).json({ todos });
});

/* 해야 할 일 순서 변경 API */
router.patch("/todos/:todoId", async (req, res, next) => {
  // 변경할 '해야할 일'의 ID 값을 가져온다.
  const { todoId } = req.params;
  // '해야할 일'을 몇번째 순서로 설정할 지 order 값을 가져온다.
  const { order, done, value } = req.body;

  // 현재 나의 order가 무엇인지 알아야한다.
  // 변경하려는 '해야할 일'을 가져옵니다.
  // 만약, 해당 ID값을 가진 '해야할 일'이 없다면 에러를 발생
  const currentTodo = await Todo.findById(todoId).exec();
  if (!currentTodo) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야할 일 입니다." });
  }

  if (order) {
    // 변경하려는 order 값을 가지고 있는 '해야할 일'을 찾습니다.
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      // 만약, 이미 해당 order 값을 가진 '해야할 일'이 있다면,
      // 해당 '해야할 일'의 order 값을 변경하고 저장.
      targetTodo.order = currentTodo.order;
      await targetTodo, save();
    }
    // 변경하려는 '해야할 일'의 order 값을 변경.
    currentTodo.order = order;
  }
  if (done !== undefined) {
    // 변경하려는 '해야할 일'의 doneAt 값을 변경합니다.
    currentTodo.doneAt = done ? new Date() : null;
  }

  if (value) {
    // 변경하려는 '해야할 일'의 내용을 변경합니다.
    currentTodo.value = value;
  }

  // 변경된 '해야할 일'을 저장합니다.
  await currentTodo.save();

  return res.status(200).json({});
});

/** 할 일 삭제 **/
router.delete("/todos/:todoId", async (req, res) => {
  // 삭제할 '해야할 일'의 ID 값을 가져옵니다.
  const { todoId } = req.params;

  // 삭제하려는 '해야할 일'을 가져옵니다. 만약, 해당 ID값을 가진 '해야할 일'이 없다면 에러를 발생시킵니다.
  const todo = await Todo.findById(todoId).exec();
  if (!todo) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 todo 데이터입니다." });
  }

  // 조회된 '해야할 일'을 삭제합니다.
  await Todo.deleteOne({ _id: todoId }).exec(); // 위에 todo 아이디

  return res.status(200).json({});
});

export default router;
