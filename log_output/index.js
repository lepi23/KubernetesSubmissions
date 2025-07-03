const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

const startupRandomString = uuidv4();

const randomStringWithTimestamp = () => {
  const timestamp = new Date().toISOString();
  return `${timestamp}: ${startupRandomString}`;
}

// Log on startup
console.log(randomStringWithTimestamp());

// Log every 5 seconds
setInterval(() => {
  console.log(randomStringWithTimestamp());
}, 5000);

// Add /status endpoint
app.get('/status', (req, res) => {
  const timestamp = new Date().toISOString();
  res.json({
    timestamp,
    randomString: startupRandomString,
  });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
