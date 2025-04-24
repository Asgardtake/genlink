// server.js
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://genlink-production.up.railway.app'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'genlink_session_secret', // Можеш да смениш с произволен string
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 часа
    sameSite: 'lax',
    secure: false
  }
}));


// Връзка с MySQL база данни
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE, // <-- това е правилната!
  port: process.env.MYSQLPORT
});



db.connect((err) => {
  if (err) {
    console.error('Грешка при свързване с базата данни:', err);
    return;
  }
  console.log('Свързано с MySQL базата данни');
});

const path = require('path');

// Правим папката "genlink" статична
app.use(express.static(path.join(__dirname)));


// Проверка дали има активна сесия (използва се от клиента)
app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Изход (logout) – изтриване на сесията
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Грешка при изход' });
    }
    res.clearCookie('connect.sid'); // премахва cookie от браузъра
    res.json({ success: true, message: 'Излязохте успешно' });
  });
});


// Стартиране на сървъра
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сървърът работи на http://0.0.0.0:${PORT}`);
});

// Проверка дали потребител съществува по username
app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("❌ Грешка в /check-username:", err); // ще излезе в Railway logs
      return res.status(500).json({ error: 'DB error' });
    }

    console.log(`✅ Проверка на username '${username}', резултати:`, results.length);
    res.json({ exists: results.length > 0 });
  });
});


// Проверка за имейл
app.get('/api/check-email/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ exists: results.length > 0 });
  });
});

// Вход – проверка дали user, email и парола съвпадат
app.post('/api/login', (req, res) => {
  const { username, email, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND email = ? AND password = ?';
  db.query(query, [username, email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Невалидни данни' });
    }
    
    const user = results[0];
    
    // Създаване на сървърна сесия
    req.session.user = {
      id: user.ID,
      username: user.Username,
      email: user.Email
    };
    
    res.json({
      success: true,
      user: req.session.user
});

  });
});

// Регистрация – създаване на нов user
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, password, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

// Изчистване на всички генерирани URL-и
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

// Запис на нов кратък линк за потребителя (в Link1, Link2 или Link3)
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

    // Всичко е пълно → цикличен презапис
    let next = (user.LastSavedIndex + 1) % 3;
    const field = `Link${next + 1}`;
    const updateQuery = `UPDATE users SET ${field} = ?, LastSavedIndex = ? WHERE Username = ?`;

    db.query(updateQuery, [shortUrl, next, username], (err3) => {
      if (err3) return res.status(500).json({ error: 'DB error (overwrite)' });
      res.json({ success: true, message: `Презаписан в ${field}` });
    });
  });
});


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

console.log("rebuild")

// Връща генерираните линкове на логнатия потребител
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

