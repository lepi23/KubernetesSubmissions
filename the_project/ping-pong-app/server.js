const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const SHARED_DIR = '/shared';
const COUNTER_FILE = path.join(SHARED_DIR, 'pingpong-count.txt');

let counter = 0;

// Ensure shared directory exists
if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

// Load counter if file exists
if (fs.existsSync(COUNTER_FILE)) {
  counter = parseInt(fs.readFileSync(COUNTER_FILE, 'utf8')) || 0;
}

app.get('/pingpong', (req, res) => {
  counter++;
  fs.writeFileSync(COUNTER_FILE, String(counter));  // This line used to crash
  res.send(`pong ${counter}`);
});

app.listen(3000, () => {
  console.log('Ping-Pong app listening on port 3000');
});