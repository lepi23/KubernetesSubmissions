// the_project/log_output/log-reader.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const LOG_FILE = '/shared/log.txt';

app.get('/logoutput', (req, res) => {
  if (fs.existsSync(LOG_FILE)) {
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    res.type('text/plain').send(content);
  } else {
    res.status(404).send('Log file not found.');
  }
});

app.listen(3000, () => {
  console.log('Log reader running on port 3000');
});
