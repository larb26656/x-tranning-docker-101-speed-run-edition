const express = require('express');

const app = express();

app.get('/', (req, res) => {
  const userName = process.env.USER_NAME || 'Guest';
  res.send(`Greetings, ${userName}! Welcome to the Node.js application.`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
