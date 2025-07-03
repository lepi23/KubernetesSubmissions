const { v4: uuidv4 } = require('uuid');

const randomStringWithTimestamp = () => {
    const randomString = uuidv4();
    const timestamp = new Date().toISOString();
    return `${timestamp}: ${randomString}`
}

// randomize string on startup
console.log(randomStringWithTimestamp());


//randomize string every 5 secondds after startup
setInterval(() => {
  console.log(randomStringWithTimestamp());
}, 5000);


