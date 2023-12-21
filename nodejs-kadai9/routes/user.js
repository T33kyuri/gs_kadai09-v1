// ユーザーに関する情報を管理

const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
  res.send("ユーザーです"); 
});

router.get("/info", (req, res) => {
  res.send("ユーザー情報です"); 
});

router.get("/:id",  (req, res) => {
  res.send(`${req.params.id}のユーザー情報を取得しました`);
  // ランダムなidを入力してreq.params.idで取得する
  //getではなく、postやdeleteメソッドでも可能
});
// 下記のpostやdeleteメソッドを使用する場合は、フォームの設定が必要
// router.post("/:id",  (req, res) => {
//   res.send(`${req.params.id}のユーザー情報を取得しました`);
// });
// router.delete("/:id",  (req, res) => {
//   res.send(`${req.params.id}のユーザー情報を取得しました`);
// });



module.exports = router;

