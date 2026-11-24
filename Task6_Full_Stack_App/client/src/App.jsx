import { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  // Runs once when the page opens: ask the API for all users
  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch(() => setError('Could not reach the server. Is it running?'))
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>User Management System</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} – {user.email} – age {user.age}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App