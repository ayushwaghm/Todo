const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let todos = [
  { id: 1, title: 'create frontend', completed: false },
  { id: 2, title: 'create backend', completed: false },
  { id: 3, title: 'do homework', completed: false }
];

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET a single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.sendStatus(404);
  res.json(todo);
});

// POST create new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const todo = {
    id: Date.now(),
    title,
    completed: false
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT toggle completion
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.sendStatus(404);
  todo.completed = !todo.completed;
  res.json(todo);
});

// PATCH to update title
app.patch('/todos/:id', (req, res) => {
  const { title } = req.body;
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.sendStatus(404);
  if (!title) return res.status(400).json({ error: "Title is required" });
  todo.title = title;
  res.json(todo);
});


// DELETE a todo
app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.sendStatus(204);
});

app.listen(3001);
