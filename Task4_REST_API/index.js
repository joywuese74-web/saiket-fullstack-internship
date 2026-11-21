// 1. Load Express and create the app
const express = require('express')
const app = express()
const PORT = 3000

// 2. Let the server read JSON sent in requests (needed for POST and PUT)
app.use(express.json())

// 3. TEMPORARY DATA STORE
//    For now, users live in this array (in the server's memory).
//    They reset when the server restarts. In Task 5 we'll use a real database.
let users = [
  { id: 1, name: 'Ada Okafor', email: 'ada@example.com', age: 25 },
  { id: 2, name: 'Grace Adah', email: 'grace@example.com', age: 30 },
]
let nextId = 3   // the id the next new user will get

// 4. VALIDATION: check a user's details, return a list of problems ([] = all good)
function validateUser(user, currentId = null) {
  const errors = []

  if (typeof user.name !== 'string' || user.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters.')
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof user.email !== 'string' || !emailPattern.test(user.email)) {
    errors.push('A valid email is required.')
  } else {
    // No two users may share an email (ignore the user being updated)
    const taken = users.some(
      (u) => u.email.toLowerCase() === user.email.toLowerCase() && u.id !== currentId
    )
    if (taken) errors.push('This email is already used by another user.')
  }

  if (!Number.isInteger(user.age) || user.age < 1 || user.age > 120) {
    errors.push('Age is required and must be a whole number between 1 and 120.')
  }

  return errors
}

// 5. ROUTES

// Welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the SaiKet Users API 🚀' })
})

// READ all users
app.get('/api/users', (req, res) => {
  res.json(users)
})

// READ one user by id
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found.` })
  }
  res.json(user)
})

// CREATE a new user
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body || {}

  const errors = validateUser({ name, email, age })
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  const newUser = { id: nextId, name: name.trim(), email: email.trim(), age }
  nextId++
  users.push(newUser)

  res.status(201).json(newUser)   // 201 = "Created"
})

// UPDATE a user (send any of: name, email, age)
app.put('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found.` })
  }

  // Start from the current details and replace only what was sent
  const body = req.body || {}
  const updated = {
    ...user,
    ...(body.name !== undefined && { name: body.name }),
    ...(body.email !== undefined && { email: body.email }),
    ...(body.age !== undefined && { age: body.age }),
  }

  const errors = validateUser(updated, id)
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  updated.name = updated.name.trim()
  updated.email = updated.email.trim()
  users = users.map((u) => (u.id === id ? updated : u))

  res.json(updated)
})

// DELETE a user
app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found.` })
  }

  users = users.filter((u) => u.id !== id)
  res.json({ message: `User ${id} deleted.`, user })
})

// Any other URL: 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})