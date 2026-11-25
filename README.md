# SaiKet Systems – Full Stack Development Internship

**Intern:** Ayande Wuese Joy
**Duration:** November 2026
**Live site:** https://saiket-fullstack-internship.vercel.app

| Task | Project | Built with | Live | Status |
|------|---------|-----------|------|--------|
| 1 | [Static Portfolio Website](Task1_Portfolio/) | HTML, CSS, Bootstrap, JavaScript | [Open](https://saiket-fullstack-internship.vercel.app/task1/) | ✅ |
| 2 | [Responsive E-commerce Landing Page (JTech)](Task2_Landing_Page/) | HTML, CSS, Bootstrap, JavaScript | [Open](https://saiket-fullstack-internship.vercel.app/task2/) | ✅ |
| 3 | [React To-Do App](Task3_React_Todo/) | React, Vite | [Open](https://saiket-fullstack-internship.vercel.app/task3/) | ✅ |
| 4 | [REST API](Task4_REST_API/) | Node.js, Express | [API](https://saiket-fullstack-internship.vercel.app/task4/api/users) | ✅ |
| 5 | [Database Integration](Task5_Database/) | Express, PostgreSQL (Neon), SQL | [API](https://saiket-fullstack-internship.vercel.app/task5/api/users) | ✅ |
| 6 | [Full Stack User Management System](Task6_Full_Stack_App/) | React, Express, PostgreSQL | [Open](https://saiket-fullstack-internship.vercel.app/task6/) | ✅ |

Each folder has its own README explaining the project, how to run it, and screenshots of it working.

## Hosting

All six projects are hosted together on **Vercel** as one site:

- The home page (`index.html`) links to every project.
- `build.sh` copies Tasks 1–2 and builds the React apps for Tasks 3 and 6.
- The Express APIs (Tasks 4, 5 and 6) run as Vercel Functions through the `api/` folder.
- The database password is stored in Vercel's environment settings, never in the code.

> On the live site, users added through the Task 4 API are only kept for a short time, because Vercel does not allow a server to change its own files. That is exactly why Task 5 moves the data into a PostgreSQL database.