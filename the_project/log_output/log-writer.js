// log-writer.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
let latestLog = '';

const generateLog = () => {
  const timestamp = new Date().toISOString();
  latestLog = `${timestamp}: ${uuidv4()}`;
  console.log(`Generated log: ${latestLog}`);
};

setInterval(generateLog, 5000);
generateLog(); // Initial log

app.get('/log', (req, res) => {
  res.type('text/plain').send(latestLog);
});

app.listen(4000, () => {
  console.log('Log writer running on port 4000');
});