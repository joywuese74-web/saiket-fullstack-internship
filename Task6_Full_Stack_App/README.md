# Task 6 – Full Stack User Management System

A full stack web application for managing users, built for the SaiKet Systems Full Stack Development internship. It brings together everything from the earlier tasks:

- **Front end** – React (Task 3 skills)
- **Back end** – Node.js + Express REST API (Task 4)
- **Database** – PostgreSQL hosted on Neon (Task 5)

Users can be **added, viewed, updated and deleted** from a web page, and every change is saved in the database.

## How it fits together

```
┌────────────────────┐   fetch /api/users   ┌────────────────────┐    SQL queries    ┌────────────────────┐
│   React client     │ ───────────────────▶ │   Express server   │ ────────────────▶ │  PostgreSQL (Neon) │
│  localhost:5173    │ ◀─────────────────── │   localhost:3000   │ ◀──────────────── │    users table     │
│  what users see    │      JSON data       │  routes + checks   │       rows        │  where data lives  │
└────────────────────┘                      └────────────────────┘