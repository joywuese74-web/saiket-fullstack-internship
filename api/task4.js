// Vercel runs this file for every /task4/... request.
// It removes "/task4" from the start of the URL, then hands the request
// to my Task 4 Express app, which expects URLs like /api/users.
const app = require('../Task4_REST_API/index.js')

module.exports = (req, res) => {
  req.url = req.url.replace(/^\/task4/, '') || '/'
  return app(req, res)
}
