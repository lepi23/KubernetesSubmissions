// log-output.js
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const PINGPONG_URL = 'http://ping-pong-svc/pingpong';

const fetchPongsAndLog = () => {
  http.get(PINGPONG_URL, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const timestamp = new Date().toISOString();
      const randomId = uuidv4();
      console.log(`${timestamp}: ${randomId}\nPing / Pongs: ${data}`);
    });
  }).on('error', err => {
    console.error('Error fetching pongs:', err.message);
  });
};

setInterval(fetchPongsAndLog, 5000);
fetchPongsAndLog(); // Initial call