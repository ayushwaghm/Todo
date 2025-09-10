const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Todo = require('../models/Todo');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('GET /todos error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET one todo by ID
router.get('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.sendStatus(404);
    res.json(todo);
  } catch (error) {
    console.error('GET /todos/:id error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new todo
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('POST /todos error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// PUT toggle completed
router.put('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.sendStatus(404);
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error('PUT /todos/:id error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update title
router.patch('/:id', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!todo) return res.sendStatus(404);
    res.json(todo);
  } catch (error) {
    console.error('PATCH /todos/:id error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    console.error('DELETE /todos/:id error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
