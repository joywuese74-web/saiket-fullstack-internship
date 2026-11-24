// Connects to the PostgreSQL database on Neon.
// The connection string comes from the .env file (never put it in the code!)
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

module.exports = pool