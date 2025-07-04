// the_project/log_output/log-writer.js
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const LOG_FILE = '/shared/log.txt';

const randomStringWithTimestamp = () => {
  const timestamp = new Date().toISOString();
  return `${timestamp}: ${uuidv4()}`;
}

const writeLog = () => {
  const randomString = randomStringWithTimestamp();
  fs.appendFileSync(LOG_FILE, randomString+ '\n');
  console.log(`Wrote: ${randomString.trim()}`);
};

setInterval(writeLog, 5000);
writeLog(); // initial write