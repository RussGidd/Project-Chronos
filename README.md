# Project Chronos

Full Stack Capstone Project  
Author: Russell Giddens

---

## 🚀 30-Second Elevator Pitch

Project Chronos is a full-stack timekeeping management application built for small businesses that need a cleaner and more reliable way to track employee work hours. Employees use a simple kiosk-style interface to begin shifts, start and end lunch, end shifts, and view their hours for the day or week. Administrators use a secure dashboard to monitor employee status in real time, review punch history, sort workers by hours worked, and correct timekeeping errors. The long-term goal is to support fairer scheduling decisions by giving managers accurate labor data instead of guesswork.

---

## 🎯 Core MVP Features

These are the core features planned for the minimum viable product.

### 1. Employee Authentication
- Employees log in with a 5-digit employee number and 5-digit PIN
- Employees do not create their own accounts
- Administrator creates employee accounts

### 2. Employee Timekeeping Actions
- Begin Shift
- Clock Out for Lunch
- Clock In from Lunch
- End Shift

### 3. Employee Hours Page
- View hours worked today
- View hours worked for the current week
- View punch history for the selected period
- Show running totals based on raw punch data

### 4. Punch Validation Rules
- Prevent invalid actions such as lunch before shift start
- Prevent ending a shift before beginning one
- Allow certain edge cases with warning messages for admin review
- Surface possible discrepancies instead of silently failing

### 5. Admin Authentication
- Admin logs in through a separate secure flow
- Admin uses password-based authentication

### 6. Admin Dashboard
- View all employees
- See whether an employee is currently clocked in, on lunch, or clocked out
- See current day hours and week hours in real time
- Sort employees by hours worked, date of hire, or name

### 7. Admin Employee Detail Page
- View employee profile details
- View punch history
- Add, edit, or correct punch records
- Activate or deactivate employees
- Reset employee PIN if needed

---

## 🌟 Stretch Goal Features

These features are planned after the MVP is working.

- Scheduling logic based on seniority or lowest weekly hours
- Expanded role permissions for shift managers and general managers
- Visual admin alerts for missed lunch or punch issues
- Manager comments or notes on employee records
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
- administrators

Full user stories are available here:  
[User Stories](docs/user-stories.md)

---

## 🗄️ Database Design

The MVP database is designed around employees, admins, and punch records.

Detailed schema documentation is available here:  
[Database Schema](docs/database-schema.md)

Mermaid ER diagram is available here:  
[ER Diagram](diagrams/erd-mermaid.md)

---

## 🔌 API Route Planning

The backend route plan includes:
- Auth
- Employees
- Punch Records
- Hours
- Admin

Full route planning documentation is available here:  
[API Routes](docs/api-routes.md)

---

## 🧩 Frontend Planning

Planned MVP pages include:
- Home / Kiosk Page
- Employee Hours Page
- Admin Login Page
- Admin Dashboard
- Admin Employee Detail Page

Wireframe documentation is available here:  
[Wireframes](wireframes/README.md)

Frontend route planning is available here:  
[Frontend Routes](docs/frontend-routes.md)

---

## 📌 Project Management Plan

This project will be managed through GitHub using repository issues and planning documents.

Current planning includes:
- README pitch documentation
- database schema design
- Mermaid ER diagram
- API route planning
- user stories
- wireframe planning
- frontend route planning
- build order planning
- project folder structure

Since this is a solo capstone project, tasks are being organized by feature priority and development order.

---

## 📂 Repository Structure

    Project-Chronos/
    │
    ├── README.md
    ├── docs/
    │   ├── api-routes.md
    │   ├── build-order.md
    │   ├── database-schema.md
    │   ├── frontend-routes.md
    │   └── user-stories.md
    ├── diagrams/
    │   └── erd-mermaid.md
    └── wireframes/
        ├── README.md
        └── wireframe.png

---

## 🛠️ Development Plan

Recommended build order is available here:  
[Build Order Plan](docs/build-order.md)

---

## 🔮 Future Improvements

- Fair scheduling recommendations based on employee hours
- Real-time labor issue alerts
- Manager-level role hierarchy
- Payroll integration
- Schedule publishing tools
- Text notification support

---

## 👤 Author

Russell Giddens  
Full Stack Academy Capstone Project
