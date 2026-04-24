# Project Chronos

Full Stack Capstone Project  
Author: Russell Giddens

---

## 🚀 30-Second Elevator Pitch

Project Chronos is a full-stack timekeeping management application built for small businesses that need a cleaner and more reliable way to track employee work hours. Employees can log in with an employee number and PIN to begin shifts, clock out and back in for lunch, end shifts, and view lunch-aware weekly hour totals with punch details and running time while a shift is open. Employees with admin permissions can access protected management views to load employees, create, deactivate, reactivate, and delete employee accounts, review an employee's weekly shift and punch history, navigate between work weeks, view weekly and daily hour totals, add short shift-level admin notes, and correct existing punch times inline. Chronos is designed as a role-aware full-stack system today, with a long-term goal of growing into a fuller labor management tool that helps managers review hours and make fairer scheduling decisions with accurate timekeeping data.

---

## 🎯 Core MVP Features

These are the core features currently implemented in the Project Chronos MVP.

### 1. Authentication and Role-Based Access
- Employees log in with a system-generated employee number and PIN
- JWT authentication is used for protected API access
- Employees and admins are managed from the same employees table
- Admin access is controlled through the employee role
- Inactive employee accounts cannot log in or use protected actions

### 2. Employee Timekeeping Actions
- Begin Shift
- Clock Out for Lunch
- Clock In from Lunch
- End Shift

### 3. Employee Weekly Hours View
- View lunch-aware hours worked for the current week
- View daily totals, total weekly hours, and punch details
- Show running time while a shift is still open

### 4. Shift and Lunch Validation Rules
- Prevent beginning a new shift when an open shift already exists
- Prevent lunch actions without an open shift
- Prevent duplicate lunch-start actions
- Prevent ending a shift while the employee is still on lunch

### 5. Admin Employee Management
- View all employees
- Create employee accounts
- Change an employee between active and inactive status
- Delete employee accounts with confirmation
- Select an employee to review weekly history
- View weekly and daily hour totals for a selected employee

### 6. Admin Employee Detail and Punch Correction
- View employee profile details and weekly history
- Navigate employee history by week
- Add, edit, and delete short admin notes for individual shifts
- Edit existing punch times with confirmation
- Prevent admins from editing another admin's punches
- Prevent admins from deleting themselves or another admin
- Keep create-employee validation and result messaging visible in the admin UI

---

## 🌟 Stretch Goal Features

These are reasonable expansion ideas beyond the current implemented MVP.

- Scheduling logic based on seniority or lowest weekly hours
- Expanded role permissions for shift managers and general managers
- Admin tools to add missing punches, not just edit existing ones
- Edit history for changed punches
- Leave, vacation, medical, or restricted employee statuses
- Kiosk screensaver and auto-logout behavior
- Improved mobile responsiveness
- Payroll export or approval workflow
- Automatic schedule messaging to employees

---

## 👤 MVP User Stories

Project Chronos is designed for two main user types in the MVP:
- employees
- administrators with elevated permissions

Full user stories are available here:  
[User Stories](docs/user-stories.md)

---

## 🗄️ Database Design

The MVP database is designed around:
- Employees
- Shifts
- Time Punches

Administrators are not stored in a separate table. Instead, elevated access is handled through a role field on the employees table.

Detailed schema documentation is available here:  
[Database Schema](docs/database-schema.md)

Mermaid ER diagram is available here:  
[ER Diagram](diagrams/erd-mermaid.md)

---

## 🔌 API Route Planning

The current backend is organized around these implemented route groups:
- Auth
- Employees
- Shifts

Current backend route documentation is available here:  
[API Routes](docs/api-routes.md)

---

## 🧩 Frontend Planning

The current frontend is intentionally built as one role-aware React application:
- Login with kiosk-inspired employee time entry
- Employee shift actions and weekly hours view
- Admin employee list, weekly history review, and employee creation tools

Early wireframe documentation is available here:  
[Wireframes](wireframes/README.md)

Current frontend structure notes are available here:  
[Frontend Structure](docs/frontend-routes.md)

---

## 📌 Project Management Plan

This project will be managed through GitHub using repository issues and planning documents.

Current planning includes:
- README pitch documentation
- database schema design
- Mermaid ER diagram
- API route documentation
- user stories
- wireframe planning
- frontend structure documentation
- build order planning
- project folder structure

Since this is a solo capstone project, tasks are being organized by feature priority and development order.

---

## 📂 Repository Structure

```text
Project-Chronos/
├── README.md
├── package.json
├── package-lock.json
├── .gitignore
│
├── client/
│   ├── README.md
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── main.jsx
│       │
│       └── assets/
│           └── earth-from-space.webp
│
├── server/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── middleware/
│   │   ├── requireAdmin.js
│   │   └── requireUser.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   └── shifts.js
│   │
│   ├── utils/
│   │   └── jwt.js
│   │
│   └── db/
│       ├── client.js
│       ├── schema.sql
│       ├── seed.js
│       │
│       └── queries/
│           ├── connections.js
│           ├── employees.js
│           ├── shifts.js
│           └── timePunches.js
│
├── diagrams/
│   └── erd-mermaid.md
│
├── docs/
│   ├── api-routes.md
│   ├── build-order.md
│   ├── database-schema.md
│   ├── frontend-routes.md
│   └── user-stories.md
│
└── wireframes/
    ├── README.md
    └── wireframe.png
```

---

## 🛠️ Development Plan

Recommended build order is available here: [Build Order Plan](docs/build-order.md)

---

## 🔮 Future Improvements

- Fair scheduling recommendations based on employee hours
- Insert missing punches from the admin interface
- Manager-level role hierarchy
- Payroll integration
- Schedule publishing tools
- Text notification support

---

## 👤 Author

Russell Giddens  
Full Stack Academy Capstone Project
