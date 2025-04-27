const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// 🟢 Първо JSON middleware
app.use(express.json());

// 🟢 Статични файлове
app.use(express.static(path.join(__dirname, "..")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "genlinkdb"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Неуспешна връзка с базата:", err);
  } else {
    console.log("✅ Успешно свързване с базата.");
  }
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("❌ Грешка при заявка:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.delete("/api/delete-user/:username", (req, res) => {
  const { username } = req.params;

  const query = "DELETE FROM users WHERE Username = ?";
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

app.post("/api/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});



const mysql = require('mysql2');
// Връзка към твоя Railway MySQL база
const connection = mysql.createConnection({
    host: 'ТВОЯ_HOST',   // напр. 'containers-us-west-94.railway.app'
    user: 'ТВОЯ_USER',
    password: 'ТВОЯ_PASSWORD',
    database: 'ТВОЯ_DATABASE',
    port: 3306 // или друг порт от Railway
});
connection.connect((err) => {
    if (err) {
        console.error('Грешка при връзка с базата:', err);
        return;
    }
    console.log('Успешно свързан с базата');
});
// Само проверка по username И password от базата
app.post('/api/admin_login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Липсват данни' });
    }
    connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (error, results) => {
            if (error) {
                console.error('Грешка при заявката:', error);
                return res.status(500).json({ success: false, message: 'Грешка в базата' });
            }
            if (results.length > 0) {
                // Има такъв потребител с това име и парола
                res.status(200).json({ success: true });
            } else {
                // Няма такъв потребител
                res.status(401).json({ success: false, message: 'Невалидни данни' });
            }
        }
    );
});



app.listen(3000, () => {
  console.log("🚀 Admin сървърът работи на http://localhost:3000");
});
