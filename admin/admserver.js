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

// Създай връзка към Railway базата
const connection = mysql.createConnection({
    host: 'твоя-host',   // Пример: 'containers-us-west-94.railway.app'
    user: 'твоя-username',
    password: 'твоя-password',
    database: 'твоя-database',
    port: 3306 // Или ако Railway ти даде друг порт
});

// Свързване с базата
connection.connect((err) => {
    if (err) {
        console.error('Грешка при връзката с базата:', err);
        return;
    }
    console.log('Свързано с MySQL базата');
});

// Маршрут за вход на админ
app.post('/api/admin_login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    // Търси админа в базата
    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (error, results) => {
            if (error) {
                console.error('Грешка при заявка:', error);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            const user = results[0];

            // Проверка дали паролата съвпада
            if (user.password === password) {
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        }
    );
});


app.listen(3000, () => {
  console.log("🚀 Admin сървърът работи на http://localhost:3000");
});
