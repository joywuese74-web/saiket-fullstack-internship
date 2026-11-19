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

// ---------- HELPERS ----------

// Turn "2026-11-21" and "15:00" into something readable, like "Sat, 21 Nov · 3:00 PM"
function formatDue(date, time) {
  if (!date) return ''
  const due = new Date(date + 'T' + (time || '00:00'))
  const day = due.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  if (!time) return day
  const hour = due.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return day + ' · ' + hour
}

// Is this task past its due date/time (and not done yet)?
function isOverdue(todo) {
  if (!todo.date || todo.done) return false
  const due = new Date(todo.date + 'T' + (todo.time || '23:59'))
  return due < new Date()
}

function App() {
  // ---------- STATE ----------

  // Starting tasks, used only the very first time (when nothing is saved yet)
  const defaultTodos = [
    { id: 1, text: 'Finish SaiKet Task 3', done: false, date: '', time: '', note: 'Add, edit and delete tasks' },
    { id: 2, text: 'Post on LinkedIn', done: true, date: '', time: '', note: '' },
    { id: 3, text: 'Learn React state', done: false, date: '', time: '', note: '' },
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

  // The "add task" form
  const [newTask, setNewTask] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newNote, setNewNote] = useState('')
  const [error, setError] = useState('')

  // Editing: which task, and a "draft" copy of its fields while you edit
  const [editingId, setEditingId] = useState(null)   // id of the task being edited (null = none)
  const [draft, setDraft] = useState({ text: '', date: '', time: '', note: '' })

  const [filter, setFilter] = useState('all')        // 'all', 'active' or 'completed'

  // Save the tasks to the browser whenever "todos" changes
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos))
    } catch {
      // Storage blocked (e.g. private mode): the app still works, it just won't remember
    }
  }, [todos])

  // ---------- ACTIONS ----------

  // ADD a task
  function handleAdd(event) {
    event.preventDefault()

    const text = newTask.trim()
    if (text === '') {
      setError('Please type a task first.')
      return
    }
    if (newTime && !newDate) {
      setError('Please pick a date for this time.')
      return
    }

    const task = {
      id: Date.now(),
      text: text,
      done: false,
      date: newDate,          // '' if no date was picked
      time: newTime,          // '' if no time was picked
      note: newNote.trim(),   // '' if no note was written
    }
    setTodos([...todos, task])

    // Clear the form
    setNewTask('')
    setNewDate('')
    setNewTime('')
    setNewNote('')
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

  // EDIT: step 1, open the edit box with the task's current details
  function startEdit(todo) {
    setEditingId(todo.id)
    setDraft({
      text: todo.text,
      date: todo.date || '',
      time: todo.time || '',
      note: todo.note || '',
    })
  }

  // Update one field of the draft (text, date, time or note)
  function updateDraft(field, value) {
    setDraft({ ...draft, [field]: value })
  }

  // EDIT: step 2, save the changes
  function saveEdit(event) {
    event.preventDefault()

    const text = draft.text.trim()
    if (text === '') return              // don't allow an empty task

    setTodos(
      todos.map((todo) =>
        todo.id === editingId
          ? { ...todo, text: text, date: draft.date, time: draft.date ? draft.time : '', note: draft.note.trim() }
          : todo
      )
    )
    setEditingId(null)                   // close the edit box
  }

  // EDIT: cancel without saving
  function cancelEdit() {
    setEditingId(null)
  }

  // CLEAR COMPLETED: keep only the tasks that are not done
  function clearCompleted() {
    setTodos(todos.filter((todo) => !todo.done))
  }

  // ---------- CALCULATED VALUES ----------

  const tasksLeft = todos.filter((todo) => !todo.done).length
  const completedCount = todos.length - tasksLeft

  // Which tasks to SHOW, depending on the selected filter
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done
    if (filter === 'completed') return todo.done
    return true                                      // 'all'
  })

  // ---------- WHAT TO SHOW ----------
  return (
    <div className="app">
      <div className="todo-card">
        <h1>My To-Do List</h1>
        <p className="subtitle">
          {tasksLeft} of {todos.length} task{todos.length === 1 ? '' : 's'} left
        </p>

        {/* ADD FORM */}
        <form className="add-form" onSubmit={handleAdd}>
          <div className="todo-form">
            <input
              type="text"
              placeholder="What do you need to do?"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
            />
            <button type="submit">Add</button>
          </div>

          <div className="extra-fields">
            <label>
              <span>Date</span>
              <input
                type="date"
                value={newDate}
                onChange={(event) => setNewDate(event.target.value)}
              />
            </label>
            <label>
              <span>Time</span>
              <input
                type="time"
                value={newTime}
                onChange={(event) => setNewTime(event.target.value)}
              />
            </label>
          </div>

          <textarea
            className="note-input"
            rows="2"
            maxLength="150"
            placeholder="Short note (optional)"
            value={newNote}
            onChange={(event) => setNewNote(event.target.value)}
          />
        </form>
        {error && <p className="error">{error}</p>}

        {/* FILTER BUTTONS */}
        {todos.length > 0 && (
          <div className="filters">
            <button
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('all')}
            >
              All ({todos.length})
            </button>
            <button
              className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('active')}
            >
              Active ({tasksLeft})
            </button>
            <button
              className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>
        )}

        {todos.length === 0 && (
          <p className="empty">🎉 Nothing to do. Add a task above!</p>
        )}
        {todos.length > 0 && visibleTodos.length === 0 && (
          <p className="empty">
            {filter === 'active' ? 'All done! 🎉' : 'No completed tasks yet.'}
          </p>
        )}

        {/* TASK LIST */}
        <ul className="todo-list">
          {visibleTodos.map((todo) =>
            todo.id === editingId ? (
              // ----- EDIT MODE: inputs with Save and Cancel -----
              <li key={todo.id} className="todo-item editing">
                <form className="edit-form" onSubmit={saveEdit}>
                  <input
                    type="text"
                    className="edit-text"
                    value={draft.text}
                    onChange={(event) => updateDraft('text', event.target.value)}
                    onKeyDown={(event) => event.key === 'Escape' && cancelEdit()}
                    autoFocus
                  />
                  <div className="extra-fields">
                    <label>
                      <span>Date</span>
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(event) => updateDraft('date', event.target.value)}
                      />
                    </label>
                    <label>
                      <span>Time</span>
                      <input
                        type="time"
                        value={draft.time}
                        onChange={(event) => updateDraft('time', event.target.value)}
                      />
                    </label>
                  </div>
                  <textarea
                    className="note-input"
                    rows="2"
                    maxLength="150"
                    placeholder="Short note (optional)"
                    value={draft.note}
                    onChange={(event) => updateDraft('note', event.target.value)}
                  />
                  <div className="edit-actions">
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" className="cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              // ----- NORMAL MODE: checkbox, details, edit and delete buttons -----
              <li
                key={todo.id}
                className={
                  'todo-item' + (todo.done ? ' done' : '') + (isOverdue(todo) ? ' overdue' : '')
                }
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />

                <div className="todo-body">
                  <span className="todo-text">{todo.text}</span>

                  {todo.date && (
                    <span className="todo-due">
                      📅 {formatDue(todo.date, todo.time)}
                      {isOverdue(todo) && <strong> · Overdue</strong>}
                    </span>
                  )}

                  {todo.note && <p className="todo-note">📝 {todo.note}</p>}
                </div>

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

        {/* CLEAR COMPLETED */}
        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  )
}

export default App
