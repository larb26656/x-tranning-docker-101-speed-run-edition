const express = require('express');
const mysql = require('mysql');

const app = express();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

function checkDatabaseConnection(callback) {
  const db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error(`Database connection error: ${err.stack}`);
      callback(err);
      return;
    }
    console.log('MySQL Connected');

    db.query('SELECT 1', (queryErr) => {
      db.end(); // Close the connection after executing the query
      if (queryErr) {
        console.error(`Database query error: ${queryErr.stack}`);
        callback(queryErr);
        return;
      }
      callback(null, 'Database is healthy');
    });
  });

  db.on('error', (err) => {
    console.error(`Database error: ${err.stack}`);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      // Handle disconnection
    } else {
      throw err;
    }
  });
}

app.get('/', (req, res) => {
  const userName = process.env.USER_NAME || 'Guest';
  res.send(`Greetings, ${userName}! Welcome to the Node.js application.`);
});

app.get('/db-health', (req, res) => {
  checkDatabaseConnection((err, result) => {
    if (err) {
      res.status(500).send('Database connection error');
      return;
    }
    res.send(result);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));