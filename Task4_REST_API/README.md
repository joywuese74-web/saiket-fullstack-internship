# Task 4 – REST API with Node.js and Express

A RESTful API for managing **users** (name, email, age), built with **Node.js** and **Express** for the SaiKet Systems Full Stack Development internship. Users are stored in a JSON file (`users.json`), so data is kept even when the server restarts.

## Features
- **Full CRUD** – create, read, update and delete users
- **Data saved to a file** – every create, update and delete is written to `users.json`
- **Automatic IDs** – each new user gets the highest existing ID + 1
- **Validation** on the server:
  - name: required, at least 2 characters
  - email: required, valid format, and unique (no two users can share an email)
  - age: required, a whole number between 1 and 120
- **Partial updates** – `PUT` changes only the fields you send
- **Clear error messages** with the correct HTTP status codes

## Endpoints

| Method | Endpoint | Description | Success |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | 200 OK |
| GET | `/api/users/:id` | Get one user by ID | 200 OK |
| POST | `/api/users` | Create a user | 201 Created |
| PUT | `/api/users/:id` | Update a user | 200 OK |
| DELETE | `/api/users/:id` | Delete a user | 200 OK |

### Example request body (POST)
```json
{
  "name": "Wuese Joy",
  "email": "wuese@example.com",
  "age": 25
}
```

### Example response (201 Created)
```json
{
  "id": 3,
  "name": "Wuese Joy",
  "email": "wuese@example.com",
  "age": 25
}
```

### Example request body (PUT – update only the age)
```json
{
  "age": 26
}
```

## Status codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT or DELETE |
| 201 | Created | A user was created |
| 400 | Bad Request | Invalid data, duplicate email, or nothing sent to update |
| 404 | Not Found | No user with that ID, or an unknown route |

## Project structure
```
Task4_REST_API/
├── index.js          ← the server, routes and validation
├── users.json        ← where users are stored (created automatically)
├── package.json      ← project info and scripts
└── screenshots/      ← Postman test results
```

## How to Run
```bash
npm install
npm run dev
```
The server starts at **http://localhost:3000**.

- `npm run dev` restarts the server automatically when `index.js` changes.
- `npm start` runs it normally.
- To reset to the two sample users, stop the server, delete `users.json`, and start it again.

## Testing with Postman
All endpoints were tested with **Postman** (VS Code extension). For `POST` and `PUT`, the body is sent as **raw → JSON**.

| # | Test | Expected result |
|---|------|-----------------|
| 1 | GET all users | 200 – list of users |
| 2 | GET one user | 200 – one user |
| 3 | POST create user | 201 – new user with an ID |
| 4 | PUT update user | 200 – updated user |
| 5 | DELETE user | 200 – "User deleted" message |
| 6 | POST invalid data | 400 – list of validation errors |
| 7 | POST duplicate email | 400 – "This email is already used by another user." |
| 8 | GET user that doesn't exist | 404 – "User with id 99 not found." |

Screenshots of each test are in the `screenshots/` folder.

## Built With
Node.js, Express, JavaScript, Postman