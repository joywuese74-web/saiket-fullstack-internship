import { useState } from 'react'
import './App.css'

function App() {
  // 1. STATE: data React remembers. When it changes, React redraws the page.
  const [todos, setTodos] = useState([
    { id: 1, text: 'Finish SaiKet Task 3', done: false },
    { id: 2, text: 'Post on LinkedIn', done: true },
    { id: 3, text: 'Learn React state', done: false },
  ])
  const [newTask, setNewTask] = useState('')   // what's typed in the input box
  const [error, setError] = useState('')       // error message ('' = no error)

  // 2. ADD a task when the form is submitted
  function handleAdd(event) {
    event.preventDefault()                     // stop the page from reloading

    const text = newTask.trim()
    if (text === '') {
      setError('Please type a task first.')
      return
    }

    const task = { id: Date.now(), text: text, done: false }
    setTodos([...todos, task])                 // a NEW array: old tasks + the new one
    setNewTask('')                             // clear the input
    setError('')
  }

  // 3. WHAT TO SHOW
  return (
    <div className="app">
      <div className="todo-card">
        <h1>My To-Do List</h1>
        <p className="subtitle">You have {todos.length} task{todos.length === 1 ? '' : 's'}</p>

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

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? 'todo-item done' : 'todo-item'}>
              {todo.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App