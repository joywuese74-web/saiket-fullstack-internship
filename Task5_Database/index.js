// 1. Load Express and our database connection, then create the app
const express = require('express')
const pool = require('./db')     // the PostgreSQL connection pool (see db.js)
const app = express()
const PORT = 3000

// 2. Let the server read JSON sent in requests (needed for POST and PUT)
app.use(express.json())

// 3. HELPERS

// Turn the :id in the URL into a whole number (or null if it isn't one)
function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

// Check a user's details and return a list of problems ([] = all good).
// (Duplicate emails are now caught by the database's UNIQUE rule.)
function validateUser(user) {
  const errors = []

  if (typeof user.name !== 'string' || user.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters.')
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof user.email !== 'string' || !emailPattern.test(user.email)) {
    errors.push('A valid email is required.')
  }

  if (!Number.isInteger(user.age) || user.age < 1 || user.age > 120) {
    errors.push('Age is required and must be a whole number between 1 and 120.')
  }

  return errors
}

// 4. ROUTES
//    Each route sends an SQL query to the database with pool.query(...).
//    $1, $2, $3 are placeholders: the values go in the array after the SQL.

// Welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the SaiKet Users API (PostgreSQL edition) 🐘' })
})

// READ all users
app.get('/api/users', async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, age, created_at FROM users ORDER BY id'
  )
  res.json(result.rows)
})

// READ one user by id
app.get('/api/users/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'The id must be a positive whole number.' })

  const result = await pool.query(
    'SELECT id, name, email, age, created_at FROM users WHERE id = $1',
    [id]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: `User with id ${id} not found.` })
  }
  res.json(result.rows[0])
})

// CREATE a new user
app.post('/api/users', async (req, res) => {
  const { name, email, age } = req.body || {}

  const errors = validateUser({ name, email, age })
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  // RETURNING sends back the new row, including the id the database chose
  const result = await pool.query(
    `INSERT INTO users (name, email, age)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, age, created_at`,
    [name.trim(), email.trim().toLowerCase(), age]
  )

  res.status(201).json(result.rows[0])   // 201 = "Created"
})

// UPDATE a user (send any of: name, email, age)
app.put('/api/users/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'The id must be a positive whole number.' })

  const body = req.body || {}
  if (body.name === undefined && body.email === undefined && body.age === undefined) {
    return res.status(400).json({ error: 'Send at least one of: name, email or age (as JSON).' })
  }

  // Get the current details first
  const current = await pool.query('SELECT id, name, email, age FROM users WHERE id = $1', [id])
  if (current.rows.length === 0) {
    return res.status(404).json({ error: `User with id ${id} not found.` })
  }

  // Replace only what was sent
  const updated = {
    ...current.rows[0],
    ...(body.name !== undefined && { name: body.name }),
    ...(body.email !== undefined && { email: body.email }),
    ...(body.age !== undefined && { age: body.age }),
  }

  const errors = validateUser(updated)
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2, age = $3
     WHERE id = $4
     RETURNING id, name, email, age, created_at`,
    [updated.name.trim(), updated.email.trim().toLowerCase(), updated.age, id]
  )

  res.json(result.rows[0])
})

// DELETE a user
app.delete('/api/users/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'The id must be a positive whole number.' })

  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id, name, email, age',
    [id]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: `User with id ${id} not found.` })
  }
  res.json({ message: `User ${id} deleted.`, user: result.rows[0] })
})

// Any other URL: 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// 5. ERROR HANDLER: runs when a database query fails
app.use((err, req, res, next) => {
  // 23505 = PostgreSQL's code for "unique rule broken" (email already used)
  if (err.code === '23505') {
    return res.status(400).json({ errors: ['This email is already used by another user.'] })
  }

  console.error('Database error:', err.message)
  res.status(500).json({ error: 'Something went wrong on the server. Please try again.' })
})

// 6. Start the server (only when I run "node index.js" myself;
//    on Vercel, Vercel starts the app itself using the export below)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

module.exports = app
