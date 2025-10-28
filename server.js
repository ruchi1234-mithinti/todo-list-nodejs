const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data storage file
const DATA_FILE = path.join(__dirname, 'todos.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper function to read todos
function readTodos() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper function to write todos
function writeTodos(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// Routes

// GET all todos
app.get('/api/todos', (req, res) => {
    try {
        const todos = readTodos();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read todos' });
    }
});

// POST create a new todo
app.post('/api/todos', (req, res) => {
    try {
        const todos = readTodos();
        const newTodo = {
            id: Date.now().toString(),
            text: req.body.text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        todos.push(newTodo);
        writeTodos(todos);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// PUT update a todo
app.put('/api/todos/:id', (req, res) => {
    try {
        const todos = readTodos();
        const todoIndex = todos.findIndex(t => t.id === req.params.id);
        
        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        todos[todoIndex] = {
            ...todos[todoIndex],
            ...req.body,
            id: req.params.id
        };
        
        writeTodos(todos);
        res.json(todos[todoIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
    try {
        let todos = readTodos();
        const initialLength = todos.length;
        todos = todos.filter(t => t.id !== req.params.id);
        
        if (todos.length === initialLength) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        writeTodos(todos);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
