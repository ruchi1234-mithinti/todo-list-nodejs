// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = [];
let currentFilter = 'all';

// API Base URL
const API_URL = '/api/todos';

// Initialize app
function init() {
    loadTodos();
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTodos();
        });
    });
}

// Load todos from server
async function loadTodos() {
    try {
        const response = await fetch(API_URL);
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
        showNotification('Failed to load tasks', 'error');
    }
}

// Add new todo
async function addTodo() {
    const text = todoInput.value.trim();
    
    if (!text) {
        showNotification('Please enter a task', 'warning');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const newTodo = await response.json();
        todos.push(newTodo);
        todoInput.value = '';
        renderTodos();
        showNotification('Task added successfully', 'success');
    } catch (error) {
        console.error('Error adding todo:', error);
        showNotification('Failed to add task', 'error');
    }
}

// Toggle todo completion
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !todo.completed })
        });
        
        const updatedTodo = await response.json();
        const index = todos.findIndex(t => t.id === id);
        todos[index] = updatedTodo;
        renderTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
        showNotification('Failed to update task', 'error');
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        todos = todos.filter(t => t.id !== id);
        renderTodos();
        showNotification('Task deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting todo:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// Render todos
function renderTodos() {
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    todoList.innerHTML = '';
    
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
        todoList.style.display = 'none';
    } else {
        emptyState.classList.remove('show');
        todoList.style.display = 'block';
        
        filteredTodos.forEach(todo => {
            const li = createTodoElement(todo);
            todoList.appendChild(li);
        });
    }
    
    updateStats();
}

// Create todo element
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    
    return li;
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = `Total: ${total}`;
    completedTasksEl.textContent = `Completed: ${completed}`;
    pendingTasksEl.textContent = `Pending: ${pending}`;
}

// Show notification (simplified version)
function showNotification(message, type) {
    console.log(`${type.toUpperCase()}: ${message}`);
    // You can implement a more sophisticated notification system here
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
