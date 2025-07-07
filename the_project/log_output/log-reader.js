// log-reader.js
const express = require('express');
const http = require('http');

const app = express();
const LOG_URL = 'http://localhost:4000/log';
const PINGPONG_URL = 'http://ping-pong-svc/pingpong';

app.get('/logoutput', (req, res) => {
  http.get(LOG_URL, logRes => {
    let logData = '';
    logRes.on('data', chunk => logData += chunk);
    logRes.on('end', () => {
      http.get(PINGPONG_URL, pongRes => {
        let pongData = '';
        pongRes.on('data', chunk => pongData += chunk);
        pongRes.on('end', () => {
          res.type('text/plain').send(`${logData}\nPing / Pongs: ${pongData}`);
        });
      }).on('error', err => {
        res.type('text/plain').send(`${logData}\nPing / Pongs: ERROR (${err.message})`);
      });
    });
  }).on('error', err => {
    res.type('text/plain').send(`ERROR getting log: ${err.message}`);
  });
});

app.listen(3000, () => {
  console.log('Log reader running on port 3000');
});