import { useState } from 'react'
import './App.css'

function App() {
  // STATE
  const [todos, setTodos] = useState([
    { id: 1, text: 'Finish SaiKet Task 3', done: false },
    { id: 2, text: 'Post on LinkedIn', done: true },
    { id: 3, text: 'Learn React state', done: false },
  ])
  const [newTask, setNewTask] = useState('')
  const [error, setError] = useState('')

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

  // TICK / UNTICK a task: copy every task, but flip "done" on the one that was clicked
  function handleToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  // DELETE a task: keep every task EXCEPT the one that was clicked
  function handleDelete(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
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
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? 'todo-item done' : 'todo-item'}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                aria-label="Delete task"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App