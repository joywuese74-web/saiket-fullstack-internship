// 1. Load Express and Node's built-in file tools, then create the app
const express = require('express')
const fs = require('fs')        // read and write files
const path = require('path')    // build file paths that work on any computer
const app = express()
const PORT = 3000

// 2. Let the server read JSON sent in requests (needed for POST and PUT)
app.use(express.json())

// 3. DATA STORE: a JSON file (users.json) next to this file
//    In Task 5 we'll switch to PostgreSQL.
const DATA_FILE = process.env.VERCEL
  ? '/tmp/users.json'                        // on Vercel: a temporary copy (project files are read-only there)
  : path.join(__dirname, 'users.json')       // on my computer: the real file

// On Vercel, start the temporary copy from the users.json in the repo
if (process.env.VERCEL && !fs.existsSync(DATA_FILE)) {
  fs.copyFileSync(path.join(__dirname, 'users.json'), DATA_FILE)
}

// Read users.json. If it doesn't exist yet, create it with two sample users.
function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) {
    const starter = [
      { id: 1, name: 'Ada Okafor', email: 'ada@example.com', age: 25 },
      { id: 2, name: 'Grace Adah', email: 'grace@example.com', age: 30 },
    ]
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: starter }, null, 2))
    return starter
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  return data.users || []
}

// Write the current users back to users.json
function saveUsers() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ users }, null, 2))
}

// The next id = the highest id currently in the file + 1 (or 1 if there are no users)
function getNextId() {
  if (users.length === 0) return 1
  const ids = users.map((u) => u.id)
  return Math.max(...ids) + 1
}

let users = loadUsers()

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

  const newUser = { id: getNextId(), name: name.trim(), email: email.trim(), age }
  users.push(newUser)
  saveUsers()

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
    // Start from the current details and replace only what was sent
  const body = req.body || {}
  console.log('PUT body received:', body)   // shows in the terminal what Postman sent

  // Nothing to update? Tell the client instead of pretending it worked
  if (body.name === undefined && body.email === undefined && body.age === undefined) {
    return res.status(400).json({
      error: 'Send at least one of: name, email or age (as JSON).',
    })
  }
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
  saveUsers()

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
  saveUsers()
  res.json({ message: `User ${id} deleted.`, user })
})

// Any other URL: 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// 6. Start the server (only when I run "node index.js" myself;
//    on Vercel, Vercel starts the app itself using the export below)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

module.exports = app
