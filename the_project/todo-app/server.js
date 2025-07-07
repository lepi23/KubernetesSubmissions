const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const SHARED = '/shared';
const IMG_FILE = path.join(SHARED, 'cached.jpg');
const TS_FILE  = path.join(SHARED, 'img-timestamp.txt');

const IMG_URL      = 'https://picsum.photos/1200';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ensure shared dir
if (!fs.existsSync(SHARED)) fs.mkdirSync(SHARED, { recursive: true });

async function getCachedImage() {
  let lastFetch = 0;
  if (fs.existsSync(TS_FILE)) {
    lastFetch = +fs.readFileSync(TS_FILE, 'utf8');
  }
  if (!fs.existsSync(IMG_FILE) || Date.now() - lastFetch > CACHE_TTL_MS) {
    console.log('Fetching new image…');
    const res = await fetch(IMG_URL);          // <— built‑in fetch
    const buf = await res.arrayBuffer();
    fs.writeFileSync(IMG_FILE, Buffer.from(buf));
    fs.writeFileSync(TS_FILE, String(Date.now()));
  }
  return IMG_FILE;
}

const PORT = process.env.PORT || 3000;

// Serve static HTML from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res, next) => {
  try {
    await getCachedImage();
  } catch (e) {
    console.error('Failed to prefetch image:', e);
    // we ignore errors here so the page still loads
  }
  // send the static index.html
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// your existing todo routes here…
// e.g. app.get('/todos', …)

// Endpoint to serve the cached image
app.get('/image', async (req, res) => {
  try {
    const imgPath = await getCachedImage();
    res.sendFile(imgPath);
  } catch (err) {
    console.error('Image error:', err);
    res.status(500).send('Could not load image');
  }
});

app.post('/todos', express.json(), (req, res) => {
  const { todo } = req.body;
  // TODO: save to your backend or in-memory array
  res.json({ todo });
});


app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});