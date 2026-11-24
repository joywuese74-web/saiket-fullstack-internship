import { useState, useEffect } from 'react'
import UserTable from './components/UserTable'
import UserForm from './components/UserForm'
import './App.css'

function App() {
  // ---------- STATE ----------
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [message, setMessage] = useState(null)   // { type: 'success' | 'error', text: '...' }

  // ---------- LOAD USERS FROM THE API (once, when the page opens) ----------
  useEffect(() => {
    fetch('/api/users')
      .then((response) => {
        if (!response.ok) throw new Error()
        return response.json()
      })
      .then((data) => setUsers(data))
      .catch(() => setLoadError('Could not load users. Is the server running?'))
      .finally(() => setLoading(false))
  }, [])

  // ---------- MESSAGES ----------
  function showMessage(type, text) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)   // hide after 4 seconds
  }

  // ---------- ADD ----------
  // Sends the new user to the API. Returns a list of errors ([] = success).
  async function handleAdd(userData) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },   // like choosing "JSON" in Postman
        body: JSON.stringify(userData),
      })
      const data = await response.json()

      if (!response.ok) {
        // The API sends either { errors: [...] } or { error: '...' }
        return data.errors || [data.error || 'Could not add the user.']
      }

      setUsers([...users, data])   // add the new user (with its database id) to the table
      showMessage('success', `${data.name} was added.`)
      return []
    } catch {
      return ['Could not reach the server. Is it running?']
    }
  }

  // ---------- DELETE ----------
  async function handleDelete(user) {
    const sure = window.confirm(`Delete ${user.name}? This cannot be undone.`)
    if (!sure) return

    try {
      const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error()

      // Remove the user from the list on the page (no need to reload everything)
      setUsers(users.filter((u) => u.id !== user.id))
      showMessage('success', `${user.name} was deleted.`)
    } catch {
      showMessage('error', `Could not delete ${user.name}. Please try again.`)
    }
  }

  // ---------- WHAT TO SHOW ----------
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>User Management System</h1>
          <p className="subtitle">React · Express · PostgreSQL</p>
        </div>
        <div className="stat">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">user{users.length === 1 ? '' : 's'}</span>
        </div>
      </header>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <section className="card">
        <h2>Add a user</h2>
        <UserForm onSave={handleAdd} />
      </section>

      <section className="card">
        <h2>All users</h2>
        {loading && <p className="empty">Loading users…</p>}
        {loadError && <p className="alert alert-error">{loadError}</p>}
        {!loading && !loadError && <UserTable users={users} onDelete={handleDelete} />}
      </section>

      <footer className="page-footer">
        Built by Ayande Wuese Joy · SaiKet Systems Internship
      </footer>
    </div>
  )
}

export default App