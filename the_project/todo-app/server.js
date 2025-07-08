const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

const SHARED = '/shared';
const IMG_FILE = path.join(SHARED, 'cached.jpg');
const TS_FILE  = path.join(SHARED, 'img-timestamp.txt');

const IMG_URL      = 'https://picsum.photos/1200';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TODO_API_URL = 'http://todo-backend-svc:3001/todos'; // Cluster service

if (!fs.existsSync(SHARED)) fs.mkdirSync(SHARED, { recursive: true });

async function getCachedImage() {
  let lastFetch = 0;
  if (fs.existsSync(TS_FILE)) lastFetch = +fs.readFileSync(TS_FILE, 'utf8');
  if (!fs.existsSync(IMG_FILE) || Date.now() - lastFetch > CACHE_TTL_MS) {
    console.log('Fetching new image…');
    const res = await fetch(IMG_URL);
    const buf = await res.arrayBuffer();
    fs.writeFileSync(IMG_FILE, Buffer.from(buf));
    fs.writeFileSync(TS_FILE, String(Date.now()));
  }
  return IMG_FILE;
}

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    await getCachedImage();
  } catch (e) {
    console.error('Image prefetch failed:', e);
  }

  // Fetch todos from the backend service
  let todos = [];
  try {
    const resp = await fetch(TODO_API_URL);
    todos = await resp.json();
  } catch (err) {
    console.error('Failed to fetch todos from backend:', err.message);
  }

  // Read index.html and inject todos into the <ul id="todo-list">
  const indexPath = path.join(__dirname, 'public', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  const todoItems = todos.map(t => `<li>${t.text}</li>`).join('\n    ');
  html = html.replace(
    /<ul id="todo-list">[\s\S]*?<\/ul>/,
    `<ul id="todo-list">\n    ${todoItems}\n  </ul>`
  );

  res.send(html);
});

app.get('/image', async (req, res) => {
  try {
    const imgPath = await getCachedImage();
    res.sendFile(imgPath);
  } catch (err) {
    console.error('Image error:', err);
    res.status(500).send('Could not load image');
  }
});

app.listen(PORT, () => {
  console.log(`Todo App server listening on port ${PORT}`);
});