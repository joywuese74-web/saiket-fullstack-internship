# Task 3 – React To-Do App

A to-do list app built with **React** (using Vite) for the SaiKet Systems Full Stack Development internship.

## Features
- **Add tasks** – with validation (empty tasks are not allowed)
- **Edit tasks** – change a task's text, date, time or note; press Enter to save, Esc to cancel
- **Delete tasks**
- **Mark tasks as done** – completed tasks are crossed out
- **Due date and time** – optional; overdue tasks are highlighted in red
- **Short notes** – optional note on each task (up to 150 characters)
- **Filters** – All / Active / Completed, with live counts
- **Clear completed** – remove all finished tasks at once
- **Saved in the browser** – tasks stay after refreshing or closing the page (`localStorage`)
- **Responsive** – works on phones, tablets and laptops

## React concepts used
- **Components and JSX**
- **`useState`** – tasks, form inputs, the task being edited, the selected filter
- **`useEffect`** – saves tasks to `localStorage` whenever they change
- **Controlled inputs** – form fields always match state
- **Immutable updates** – `map`, `filter` and the spread operator (`...`) to create new arrays and objects
- **Conditional rendering** – edit mode vs normal mode, empty-list messages, overdue labels

## Built With
React, Vite, JavaScript, CSS

## How to Run
```bash
npm install
npm run dev
```
Then open http://localhost:5173

## Screenshots
See the `screenshots/` folder.