// 必要なモジュールやライブラリをインポート
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");

// ユーザールーターのインポート（未使用のためコメントアウト）
// const userRouter = require("./routes/user");
const { redirect } = require("next/dist/server/api-utils");

// サーバーのポート番号を指定
const PORT = 5000;

// ファイルアップロードや静的ファイルの利用のためのミドルウェアの設定
app.use(fileUpload());
app.use(express.static("upload"));

// テンプレートエンジンの設定
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// MySQLデータベースへの接続プールの作成
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Mr.9ri_mysql",
  database: "image-uploader-1",
});

// ホームページの表示用のルートハンドラ
app.get("/", (req, res) => {
  // 画像データを取得するクエリを実行
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MYSQLとの接続エラー", err);
      return res.status(500).send(err);
    }
    // MYSQLとの接続が成功した場合
    console.log("MYSQLと接続中");
      // 
    connection.query("SELECT * FROM image", (err, rows) => {
      connection.release();
      if (err) {
        console.error("画像データの取得エラー", err);
        return res.status(500).send(err);
      }
      console.log(rows);
      // 画像データをホームページに渡してレンダリング
      res.render("home", { rows });
    });
  });
});

// アップロード成功時の処理のためのルートハンドラ
app.post("/", (req, res) => {
  // アップロードされたファイルの処理
  let imageFile = req.files.imageFile;
  let uploadPath = __dirname + "/upload/" + imageFile.name;

  // アップロードされたファイルを指定のパスに保存
  imageFile.mv(uploadPath, function (err) {
    if (err) {
      console.error("画像アップロードエラー", err);
      return res.status(500).send(err);
    }
    // 画像アップロード成功時のレスポンス（コメントアウト）
    // res.send("画像アップロードに成功しました");
  });

  // Mysqlに画像ファイルの名前を追加し保存する。
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MYSQLとの接続エラー", err);
      return res.status(500).send(err);
    }
    console.log("MYSQLと接続中");
    // idは省略することで、オートインクリメント（自動番号割り当て）が働きます
    // クエリの実行（パラメータのバインディングを使用）
    connection.query("INSERT INTO image (imageName) VALUES (?)", [imageFile.name], (err, result) => {
      connection.release();
      if (!err) {
        // アップロード成功時にホームページにリダイレクト
        res.redirect("/");
      } else {
        console.log(err);
        return res.status(500).send(err);
      }
    });
  });
});

// サーバーの起動
app.listen(PORT, () => {
  console.log("サーバーが起動しました");
});
