const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error(`Database connection error: ${err.stack}`);
    return;
  }
  console.log('MySQL Connected');
});

app.get('/', (req, res) => {
  const userName = process.env.USER_NAME || 'Guest';
  res.send(`Greetings, ${userName}! Welcome to the Node.js application.`);
});

app.get('/db-health', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) {
      console.error(`Database connection error: ${err.stack}`);
      res.status(500).send(`Connection to ${process.env.DB_HOST} failed. Please try again.`);
      return;
    }
    res.send(`Connected to ${process.env.DB_HOST} successfully.`);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
