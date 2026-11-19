import { useState, useEffect } from 'react'
import './App.css'

// Small icons drawn with SVG (no extra library needed)
function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

function App() {
  // STATE
    // Starting tasks, used only the very first time (when nothing is saved yet)
  const defaultTodos = [
    { id: 1, text: 'Finish SaiKet Task 3', done: false },
    { id: 2, text: 'Post on LinkedIn', done: true },
    { id: 3, text: 'Learn React state', done: false },
  ]

  // Load saved tasks from the browser, or use the defaults
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('todos')
      return saved ? JSON.parse(saved) : defaultTodos
    } catch {
      return defaultTodos
    }
  })
  const [newTask, setNewTask] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)   // id of the task being edited (null = none)
  const [editText, setEditText] = useState('')       // text in the edit box
    
  // Save the tasks to the browser whenever "todos" changes
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos))
    } catch {
      // Storage blocked (e.g. private mode): the app still works, it just won't remember
    }
  }, [todos])
  // ADD a task
  function handleAdd(event) {
    event.preventDefault()

    const text = newTask.trim()
    if (text === '') {
      setError('Please type a task first.')
      return
    }

    const task = { id: Date.now(), text: text, done: false }
    setTodos([...todos, task])
    setNewTask('')
    setError('')
  }

  // TICK / UNTICK a task
  function handleToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  // DELETE a task
  function handleDelete(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // EDIT: step 1, open the edit box with the task's current text
  function startEdit(todo) {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  // EDIT: step 2, save the new text
  function saveEdit(event) {
    event.preventDefault()

    const text = editText.trim()
    if (text === '') return              // don't allow an empty task

    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, text: text } : todo
      )
    )
    setEditingId(null)                   // close the edit box
  }

  // EDIT: cancel without saving
  function cancelEdit() {
    setEditingId(null)
  }

  const tasksLeft = todos.filter((todo) => !todo.done).length

  // WHAT TO SHOW
  return (
    <div className="app">
      <div className="todo-card">
        <h1>My To-Do List</h1>
        <p className="subtitle">
          {tasksLeft} of {todos.length} task{todos.length === 1 ? '' : 's'} left
        </p>

        <form className="todo-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="What do you need to do?"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {error && <p className="error">{error}</p>}

        {todos.length === 0 && (
          <p className="empty">🎉 Nothing to do. Add a task above!</p>
        )}

        <ul className="todo-list">
          {todos.map((todo) =>
            todo.id === editingId ? (
              // ----- EDIT MODE: an input with Save and Cancel -----
              <li key={todo.id} className="todo-item editing">
                <form className="edit-form" onSubmit={saveEdit}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(event) => setEditText(event.target.value)}
                    onKeyDown={(event) => event.key === 'Escape' && cancelEdit()}
                    autoFocus
                  />
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={cancelEdit}>
                    Cancel
                  </button>
                </form>
              </li>
            ) : (
              // ----- NORMAL MODE: checkbox, text, edit and delete buttons -----
              <li key={todo.id} className={todo.done ? 'todo-item done' : 'todo-item'}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  className="icon-btn edit-btn"
                  onClick={() => startEdit(todo)}
                  aria-label="Edit task"
                  title="Edit"
                >
                  <PencilIcon />
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDelete(todo.id)}
                  aria-label="Delete task"
                  title="Delete"
                >
                  <TrashIcon />
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  )
}

export default App