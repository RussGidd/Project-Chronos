# API Routes

## Overview

Project Chronos uses a backend API to support employee authentication, employee punch actions, hours tracking, and administrator oversight.

The MVP route groups are:
- Auth
- Employees
- Punch Records
- Hours
- Admin

---

## Auth Routes

### Employee Auth

#### POST /api/auth/employee/login
Authenticate an employee using employee number and PIN.

**Request body example:**

    {
      "employeeNumber": "12345",
      "pin": "54321"
    }

**Purpose:**
- verify employee credentials
- return an employee token
- allow access to employee timekeeping actions and hours page

---

### Admin Auth

#### POST /api/auth/admin/login
Authenticate an admin using username and password.

**Request body example:**

    {
      "username": "adminUser",
      "password": "securePassword"
    }

**Purpose:**
- verify admin credentials
- return an admin token
- allow access to admin-only routes and pages

---

## Employee Routes

### GET /api/employees/:employeeId
Get a single employee profile.

**Purpose:**
- return employee profile data
- support admin employee detail page

**Tables used:**
- employees

---

### POST /api/employees
Create a new employee account.

**Purpose:**
- allow admin to add a new employee
- store login and profile information

**Tables used:**
- employees

---

### PATCH /api/employees/:employeeId
Update employee information.

**Purpose:**
- allow admin to edit employee details
- allow admin to reset employee PIN
- allow admin to activate or deactivate employees

**Tables used:**
- employees

---

## Punch Record Routes

### POST /api/punch-records
Create a new punch record.

**Request body example:**

    {
      "employeeId": 7,
      "punchType": "shift_start",
      "punchTime": "2026-03-28T08:00:00"
    }

**Purpose:**
- record shift start
- record lunch start
- record lunch end
- record shift end
- support manual admin corrections when needed

**Tables used:**
- punch_records

---

### GET /api/punch-records/:employeeId
Get punch records for one employee.

**Purpose:**
- show employee punch history
- support employee hours page
- support admin employee detail page

**Tables used:**
- punch_records

---

### PATCH /api/punch-records/:punchRecordId
Update a punch record.

**Purpose:**
- allow admin to correct a punch time
- allow admin to add notes for corrections

**Tables used:**
- punch_records

---

## Hours Routes

### GET /api/hours/:employeeId/today
Get today’s punch summary and total hours for one employee.

**Purpose:**
- show employee hours for the current day
- show running hours if employee is still clocked in

**Tables used:**
- punch_records

---

### GET /api/hours/:employeeId/week
Get current week punch summary and total hours for one employee.

**Purpose:**
- show employee hours for the week
- support employee hours page

**Tables used:**
- punch_records

---

## Admin Routes

### GET /api/admin/dashboard/today
Get current employee statuses and today’s hour totals.

**Purpose:**
- show all employees on the admin dashboard
- support sorting by hours, hire date, or name
- show whether employees are clocked in, on lunch, or clocked out

**Tables used:**
- employees
- punch_records

---

### GET /api/admin/dashboard/week
Get employee week totals for the admin dashboard.

**Purpose:**
- show all employee weekly totals
- support labor review and comparison

**Tables used:**
- employees
- punch_records

---

### GET /api/admin/employees
Get all employees for admin view.

**Purpose:**
- show searchable or sortable employee list
- support dashboard and employee detail navigation

**Tables used:**
- employees

---

## Validation Notes

The backend will also be responsible for enforcing punch rules such as:
- employee cannot start lunch before starting shift
- employee cannot end shift before starting shift
- employee cannot start lunch twice in a row
- employee cannot end lunch without first starting lunch

Some edge cases may still be allowed with warnings or admin review, depending on business rules.

---

## Future API Expansion Ideas

Possible future routes:
- scheduling routes
- audit log routes
- manager notes routes
- payroll export routes
- notification routes

These are not required for the MVP.
