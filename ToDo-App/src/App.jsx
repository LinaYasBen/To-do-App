import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([newTodo, ...todos])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditValue(text)
  }

  const saveEdit = () => {
    if (editValue.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeTodosCount = todos.filter(todo => !todo.completed).length
  const completedTodosCount = todos.filter(todo => todo.completed).length

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    }
    if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">TodoFlow</h1>
          <p className="subtitle">Organize your tasks with style</p>
        </header>

        <div className="input-section">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="todo-input"
            />
            <button onClick={addTodo} className="add-button">
              <PlusIcon className="icon" />
            </button>
          </div>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{activeTodosCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{completedTodosCount}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{todos.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        <div className="filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
          {completedTodosCount > 0 && (
            <button onClick={clearCompleted} className="clear-button">
              Clear Completed
            </button>
          )}
        </div>

        <div className="todos-container">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">
                {filter === 'completed' && todos.length > 0
                  ? 'No completed tasks yet'
                  : filter === 'active' && todos.length > 0
                  ? 'No active tasks'
                  : 'No tasks yet'}
              </h3>
              <p className="empty-description">
                {todos.length === 0
                  ? 'Add your first task to get started!'
                  : filter === 'completed'
                  ? 'Complete some tasks to see them here'
                  : 'All tasks are completed! 🎉'}
              </p>
            </div>
          ) : (
            <div className="todos-list">
              {filteredTodos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="checkbox"
                  >
                    {todo.completed && <CheckIcon className="check-icon" />}
                  </button>
                  
                  {editingId === todo.id ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={handleEditKeyPress}
                        className="edit-input"
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button onClick={saveEdit} className="save-button">
                          <CheckIcon className="icon" />
                        </button>
                        <button onClick={cancelEdit} className="cancel-button">
                          <XMarkIcon className="icon" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="todo-text">{todo.text}</span>
                      <div className="todo-actions">
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="edit-button"
                        >
                          <PencilIcon className="icon" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="delete-button"
                        >
                          <TrashIcon className="icon" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App