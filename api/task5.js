// Vercel runs this file for every /task5/... request.
// It removes "/task5" from the start of the URL, then hands the request
// to my Task 5 Express app (the PostgreSQL version).
const app = require('../Task5_Database/index.js')

module.exports = (req, res) => {
  req.url = req.url.replace(/^\/task5/, '') || '/'
  return app(req, res)
}
