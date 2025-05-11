// server.js
const express = require('express');
require('dotenv').config();
process.env.NODE_ENV = 'production';
const path = require('path');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: ['http://localhost:3000', 'https://genlink-production.up.railway.app'],
  credentials: true
}));

app.use(express.json());               // Парсване на JSON заявки
app.use(cookieParser());               // Парсване на cookies от клиента
app.set('trust proxy', 1);             // Задължително за trust при proxy (Railway, HTTPS)

// Настройка на сесии с express-session
app.use(session({
  secret: 'genlink_session_secret',    // Тайна за подписване на сесиите
  resave: false,                       // Не презаписвай сесията, ако няма промени
  saveUninitialized: false,           // Не създавай празни сесии
  proxy: true,                         // Използва се зад proxy (Railway)
  cookie: {
    httpOnly: true,                   // Cookie-то да не е достъпно от JavaScript
    sameSite: 'none',                 // За cross-origin session между Railway и клиента
    secure: true                      // Cookie-то да се изпраща само по HTTPS    
  }
}));

// Статично обслужване на файлове от текущата директория
app.use(express.static(path.join(__dirname)));

// Връзка с MySQL база данни чрез mysql2 (POOL)
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
console.log('MySQL пул от връзки е създаден');
console.log("Промяна за форсиране на билд");


// Проверка дали има активна сесия (логнат потребител)
app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({
      loggedIn: true,
      user: req.session.user,
      passwordChanged: req.session.passwordChanged || false
    });
  } else {
    res.json({ loggedIn: false });
  }
});


// Изход от акаунт – изтриване на сесия и cookie
app.post('/api/logout', (req, res) => {
  req.session.passwordChanged = false; // 🧼 изчистваме флага
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Грешка при изход' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Излязохте успешно' });
  });
});


// Обслужване на admin.html при заявка към /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Рут за обслужване на index.html при директен достъп чрез линкове (например от логото в навигацията)
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



// Проверка дали потребител съществува по username (преди регистрация)
app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("❌ Грешка в /check-username:", err);
      return res.status(500).json({ error: 'DB error' });
    }

    console.log(`Проверка на username '${username}', резултати:`, results.length);
    res.json({ exists: results.length > 0 });
  });
});

// Проверка дали имейл съществува (преди регистрация)
app.get('/api/check-email/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ exists: results.length > 0 });
  });
});

// Вход на потребител – проверка на username, email и парола
app.post('/api/login', (req, res) => {
  const { username, email, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND email = ? AND password = ?';
  db.query(query, [username, email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Невалидни данни' });
    }

    const user = results[0];

    // Запазване на данните в сесия
    req.session.user = {
      id: user.ID,
      username: user.Username,
      email: user.Email,
      password: user.Password
    };

    res.json({
      success: true,
      user: req.session.user
    });
  });
});

// 🟢 Нов маршрут за ВХОД НА АДМИНИСТРАТОР
app.post('/api/admin_login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Липсват данни' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('❌ Грешка при заявка за админ логин:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Невалидни данни' });
    }
  });
});

// Регистрация на нов потребител
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, password, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

// ✅ Смяна на парола от логнат потребител
app.post('/api/change-password', (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ success: false, message: "Липсват данни" });
  }

  const updateQuery = 'UPDATE users SET Password = ? WHERE Username = ?';
  db.query(updateQuery, [newPassword, username], (err, result) => {
    if (err) {
      console.error("❌ Грешка при обновяване на паролата:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Потребителят не е намерен" });
    }

    req.session.passwordChanged = true; // 🔐 Добавяме флаг за смяна на парола
    res.json({ success: true });
  });
});

// Изтриване на всички линкове (Link1, Link2, Link3) от всички потребители
app.post('/api/clear-urls', (req, res) => {
  const query = 'UPDATE users SET Link1 = NULL, Link2 = NULL, Link3 = NULL';
  db.query(query, (err, result) => {
    if (err) {
      console.error('❌ Грешка при изчистване на линкове:', err);
      return res.status(500).json({ error: 'Грешка при изчистване' });
    }
    res.json({ success: true, message: 'Всички линкове са изчистени.' });
  });
});

// Запазване на ново URL в Link1, Link2 или Link3, с цикличен презапис
app.post('/api/save-url', (req, res) => {
  const { username, shortUrl } = req.body;

  const selectQuery = 'SELECT Link1, Link2, Link3, LastSavedIndex FROM users WHERE Username = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error (select)' });
    if (results.length === 0) return res.status(404).json({ error: 'Потребителят не е намерен' });

    const user = results[0];

    if (!user.Link1) {
      return db.query('UPDATE users SET Link1 = ? WHERE Username = ?', [shortUrl, username], (err2) => {
        if (err2) return res.status(500).json({ error: 'DB error (L1)' });
        return res.json({ success: true, message: 'Записан в Link1' });
      });
    }
    if (!user.Link2) {
      return db.query('UPDATE users SET Link2 = ? WHERE Username = ?', [shortUrl, username], (err2) => {
        if (err2) return res.status(500).json({ error: 'DB error (L2)' });
        return res.json({ success: true, message: 'Записан в Link2' });
      });
    }
    if (!user.Link3) {
      return db.query('UPDATE users SET Link3 = ? WHERE Username = ?', [shortUrl, username], (err2) => {
        if (err2) return res.status(500).json({ error: 'DB error (L3)' });
        return res.json({ success: true, message: 'Записан в Link3' });
      });
    }

    // Циклично презаписване в Link1–3
    let next = (user.LastSavedIndex + 1) % 3;
    const field = `Link${next + 1}`;
    const updateQuery = `UPDATE users SET ${field} = ?, LastSavedIndex = ? WHERE Username = ?`;

    db.query(updateQuery, [shortUrl, next, username], (err3) => {
      if (err3) return res.status(500).json({ error: 'DB error (overwrite)' });
      res.json({ success: true, message: `Презаписан в ${field}` });
    });
  });
});

// Изтриване на един конкретен линк от логнат потребител (по име на полето)
app.post('/api/clear-link', (req, res) => {
  const { field } = req.body;
  const validFields = ['Link1', 'Link2', 'Link3'];

  if (!req.session.user || !validFields.includes(field)) {
    return res.status(400).json({ success: false });
  }

  const username = req.session.user.username;
  const query = `UPDATE users SET ${field} = NULL WHERE Username = ?`;
  db.query(query, [username], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});


// Изтриване на потребител от админ панела
app.delete('/api/delete-user/:username', (req, res) => {
  const { username } = req.params;
  const query = 'DELETE FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('❌ Грешка при изтриване на потребител:', err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Потребителят не е намерен.' });
    }
    res.json({ success: true, message: 'Потребителят е изтрит успешно.' });
  });
});

// Обновяване на потребител от админ панела
app.put('/api/update-user', (req, res) => {
  const { oldUsername, newUsername, newEmail, newPassword } = req.body;

  if (!oldUsername || !newUsername || !newEmail || !newPassword) {
    return res.status(400).json({ success: false, message: 'Липсват данни за обновяване.' });
  }

  // Проверка дали новото потребителско име или новият имейл вече съществуват за друг потребител
  const checkQuery = 'SELECT * FROM users WHERE (Username = ? OR Email = ?) AND Username != ?';
  db.query(checkQuery, [newUsername, newEmail, oldUsername], (err, results) => {
    if (err) {
      console.error('❌ Грешка при проверка на съществуващи данни:', err);
      return res.status(500).json({ success: false, message: 'Database error (check)' });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Потребителско име или имейл вече съществуват.' });
    }

    // Ако няма конфликт – правим обновяване
    const updateQuery = 'UPDATE users SET Username = ?, Email = ?, Password = ? WHERE Username = ?';
    db.query(updateQuery, [newUsername, newEmail, newPassword, oldUsername], (err2, result) => {
      if (err2) {
        console.error('❌ Грешка при обновяване на потребител:', err2);
        return res.status(500).json({ success: false, message: 'Database error (update)' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Потребителят не е намерен.' });
      }
      res.json({ success: true, message: 'Потребителят е обновен успешно.' });
    });
  });
});



// 🔄 Обновяване на профилните данни на логнат потребител (username и email)
app.post('/api/update-profile', (req, res) => {
  if (!req.session.user || !req.session.user.username) {
    return res.status(401).json({ success: false, message: 'Няма активна сесия' });
  }

  const currentUsername = req.session.user.username;
  const { username: newUsername, email: newEmail } = req.body;
  console.log("🔥 ПРОФИЛ ЗАПИС:", { currentUsername, newUsername, newEmail });

  if (!newUsername || !newEmail) {
    return res.status(400).json({ success: false, message: 'Липсват данни' });
  }

  const checkQuery = 'SELECT * FROM users WHERE (Username = ? OR Email = ?) AND Username != ?';
  db.query(checkQuery, [newUsername, newEmail, currentUsername], (err, results) => {
    if (err) {
      console.error('❌ Грешка при проверка на новите данни:', err);
      return res.status(500).json({ success: false, message: 'Database error (check)' });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Потребителско име или имейл вече съществуват.' });
    }

const updateQuery = 'UPDATE users SET Username = ?, Email = ? WHERE LOWER(Username) = LOWER(?)';
db.query(updateQuery, [newUsername, newEmail, currentUsername], (err2, result) => {
  if (err2) {
    console.error("Грешка при запис:", err2);
    return res.status(500).json({ success: false, message: 'Грешка при запис' });
  }

  console.log("⬅️ Сесия: ", req.session.user);
  console.log("➡️ Нови стойности:", newUsername, newEmail);
  console.log("🟡 UPDATE резултат:", result.affectedRows);

  req.session.user.username = newUsername;
  req.session.user.email = newEmail;

  res.json({ success: true });
});
  });
});



console.log("rebuild")
app.get('/api/user-links', (req, res) => {
  if (!req.session.user || !req.session.user.username) {
    return res.status(401).json({ success: false, message: 'Няма активна сесия' });
  }

  const username = req.session.user.username;
  const query = 'SELECT Link1, Link2, Link3 FROM users WHERE Username = ?';

  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB грешка' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Потребителят не е намерен' });

    const { Link1, Link2, Link3 } = results[0];
    const links = [Link1, Link2, Link3].filter(Boolean); // Премахваме празните
    res.json({ success: true, links });
  });
});


// Връщане на всички потребители за админ панела
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Грешка при зареждане на потребители:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// API маршрут за версия на backend-а
const APP_VERSION = 'v1.0.4'; // сменяй ръчно при промени

app.get('/api/version', (req, res) => {
  res.json({ version: APP_VERSION });
});

// Стартиране на сървъра
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сървърът работи на http://0.0.0.0:${PORT}`);
});

