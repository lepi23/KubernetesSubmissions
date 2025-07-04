// log-writer.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const SHARED_DIR = '/shared';
const LOG_FILE = path.join(SHARED_DIR, 'log.txt');

// Ensure the shared directory exists
if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

const randomStringWithTimestamp = () => {
  const timestamp = new Date().toISOString();
  return `${timestamp}: ${uuidv4()}\n`;
};

const writeLog = () => {
  const randomString = randomStringWithTimestamp();
  // Overwrite the file instead of appending
  fs.writeFileSync(LOG_FILE, randomString);
  console.log(`Wrote: ${randomString.trim()}`);
};

setInterval(writeLog, 5000);
writeLog(); // Initial write