// the_project/log_output/log-reader.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const LOG_FILE = '/shared/log.txt';
const COUNTER_FILE = '/shared/pingpong-count.txt';

app.get('/logoutput', (req, res) => {
  let log = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf-8') : '';
  let count = fs.existsSync(COUNTER_FILE) ? fs.readFileSync(COUNTER_FILE, 'utf-8') : '0';

  log += `\nPing / Pongs: ${count}`;
  res.type('text/plain').send(log);
});

app.listen(3000, () => {
  console.log('Log reader running on port 3000');
});