// admserver.js
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
require('dotenv').config(); // Зарежда .env променливите

const app = express();

// 🟢 Middleware за JSON заявки
app.use(express.json());

// 🟢 Статични файлове от главната папка (../)
app.use(express.static(path.join(__dirname, "..")));

// 🟢 Връзка с Railway MySQL база през .env променливи
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT
});

// 🟢 Свързване към базата
db.connect((err) => {
  if (err) {
    console.error("❌ Неуспешна връзка с базата:", err);
  } else {
    console.log("✅ Успешно свързване с базата.");
  }
});

// 🟢 Маршрут: Връщане на всички потребители
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("❌ Грешка при заявка:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// 🟢 Маршрут: Изтриване на потребител
app.delete("/api/delete-user/:username", (req, res) => {
  const { username } = req.params;
  const query = "DELETE FROM users WHERE username = ?";
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error("❌ Грешка при изтриване на потребител:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Потребителят не е намерен." });
    }

    res.json({ success: true, message: "Потребителят е изтрит успешно." });
  });
});

// 🟢 Маршрут: Вход за администратор (проверка username + password от базата)
app.post("/api/admin_login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Липсват данни" });
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("❌ Грешка при заявка за админ логин:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Невалидни данни" });
    }
  });
});

// 🟢 Стартиране на сървъра
app.listen(3000, () => {
  console.log("🚀 Admin сървърът работи на http://localhost:3000");
});
