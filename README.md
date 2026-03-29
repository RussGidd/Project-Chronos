# Project Chronos

Full Stack Capstone Project

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

### Employee Login
As an employee, I want to enter my employee number and PIN so that I can securely access my timekeeping options.

### Begin Shift
As an employee, I want to begin my shift quickly from a kiosk-style home screen so that I can start work without confusion.

### Lunch Out
As an employee, I want to clock out for lunch so that my meal break is recorded accurately.

### Lunch In
As an employee, I want to clock back in from lunch so that I can continue my shift and preserve an accurate time record.

### End Shift
As an employee, I want to end my shift so that my total hours for the day are recorded correctly.

### View Hours
As an employee, I want to view my hours for today and this week so that I can verify my time records and catch mistakes early.

### Admin Login
As an administrator, I want to securely log in so that only authorized users can manage employee records.

### Admin Dashboard
As an administrator, I want to see all employee timekeeping activity in one place so that I can monitor the workforce in real time.

### Sort and Review Hours
As an administrator, I want to sort employees by hours worked, hire date, or name so that I can review labor distribution more clearly.

### Correct Punch Records
As an administrator, I want to add or edit employee punches so that timekeeping mistakes can be corrected.

### Manage Employee Records
As an administrator, I want to create, deactivate, and update employee accounts so that the system reflects the current workforce.

---

## 🗄️ Planned Database Schema

> This section will be expanded with tables, columns, and relationships.

Planned core entities:
- Employees
- Admins
- Punch Records
- Employee Status / Roles

A Mermaid ER diagram will also be included in this repository.

---

## 🔌 Planned API Endpoints

> This section will be expanded as the backend design is finalized.

Planned endpoint groups:
- Auth
- Employees
- Punches
- Hours
- Admin

---

## 🧩 Planned Frontend Pages and Routes

> This section will be expanded with detailed wireframes and route planning.

Planned pages:
- Home / Kiosk Page
- Employee Hours Page
- Admin Login Page
- Admin Dashboard
- Admin Employee Detail Page

---

## 📌 Project Management Plan

This project will be managed through GitHub using repository issues and, if needed, a project board.

High-level ticket categories:
- Pitch and planning
- Database design
- Backend API
- Authentication
- Employee interface
- Admin dashboard
- Validation rules
- Styling and polish
- Testing
- Deployment preparation

Since this is a solo capstone project, tickets will be assigned by feature priority and completed in development order.

---

## 🔮 Future Improvements

- Fair scheduling recommendations based on employee hours
- Real-time alerts for labor issues
- Manager-level role hierarchy
- Payroll integration
- Schedule publishing tools
- Text notification support

---

## 👤 Author

Russell Giddens

Full Stack Academy Capstone Project
