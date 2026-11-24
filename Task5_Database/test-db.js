// Quick check that we can reach the Neon database
const pool = require('./db')

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() AS time, COUNT(*) AS users FROM users')
    console.log('✅ Connected to Neon!')
    console.log('Server time:', result.rows[0].time)
    console.log('Users in table:', result.rows[0].users)
  } catch (err) {
    console.error('❌ Could not connect:', err.message)
  } finally {
    await pool.end()   // close the connection so the script can finish
  }
}

testConnection()