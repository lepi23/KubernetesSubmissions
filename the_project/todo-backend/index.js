// the_project/todo_backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // allow requests from todo-app
app.use(express.json());

let todos = []; // in-memory store

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (typeof text === 'string' && text.length > 0 && text.length <= 140) {
    const newTodo = { id: Date.now(), text };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } else {
    res.status(400).json({ error: 'Todo must be 1-140 characters' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Todo backend running on port ${PORT}`);
});