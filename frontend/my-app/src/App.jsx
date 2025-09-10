import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:3001/todos')
      .then(response => {
        // Map MongoDB _id to id to keep your code consistent
        const data = response.data.map(todo => ({
          ...todo,
          id: todo._id,
        }));
        setTodos(data);
      })
      .catch(err => console.error('Fetch todos error:', err));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    axios.post('http://localhost:3001/todos', { title: newTodo })
      .then(() => {
        setNewTodo('');
        fetchTodos();
      })
      .catch(err => console.error('Add todo error:', err));
  };

  const toggleTodo = (id) => {
    axios.put(`http://localhost:3001/todos/${id}`)
      .then(fetchTodos)
      .catch(err => console.error('Toggle todo error:', err));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3001/todos/${id}`)
      .then(fetchTodos)
      .catch(err => console.error('Delete todo error:', err));
  };

  const startEdit = (id, title) => {
    setEditId(id);
    setEditTitle(title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return;  // Optional: prevent empty titles
    axios.patch(`http://localhost:3001/todos/${id}`, { title: editTitle })
      .then(() => {
        setEditId(null);
        setEditTitle('');
        fetchTodos();
      })
      .catch(err => console.error('Save edit error:', err));
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      
      <input
        type="text"
        value={newTodo}
        placeholder="Enter new todo..."
        onChange={e => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>💾 Save</button>
                <button onClick={cancelEdit}>❌ Cancel</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo.id)}
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  {todo.title}
                </span>
                <button onClick={() => startEdit(todo.id, todo.title)} style={{ marginLeft: 10 }}>✏️ Edit</button>
                <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 5 }}>🗑️ Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
