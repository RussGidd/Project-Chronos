# API Routes

## Overview

Project Chronos currently uses a small role-aware Express API to support:
- employee authentication
- employee shift and lunch actions
- employee weekly hours review
- admin employee management
- admin employee deletion
- admin weekly history review
- admin punch-time correction

The backend route groups currently implemented are:
- Auth
- Employees
- Shifts

---

## Auth Routes

### POST /api/auth/login
Authenticate an employee using employee number and PIN.

**Request body example:**

    {
      "employeeNumber": 2,
      "pin": "54321"
    }

**Purpose:**
- verify employee credentials
- return a JWT
- return the employee identity and role needed by the frontend

**Tables used:**
- employees

---

## Employee Routes

### GET /api/employees
Get all employees for the admin employee list.

**Access:**
- admin only

**Purpose:**
- load employee records for the admin panel
- support selecting an employee for weekly history review

**Tables used:**
- employees

---

### POST /api/employees
Create a new employee account.

**Access:**
- admin only

**Purpose:**
- create employee login and profile records
- support the admin employee creation flow

**Tables used:**
- employees

---

### DELETE /api/employees/:employeeNumber
Delete one employee account.

**Access:**
- admin only

**Purpose:**
- permanently remove an employee account
- rely on database cascade behavior to remove related shifts and punch records
- prevent admins from deleting their own account
- prevent admins from deleting another admin account

**Tables used:**
- employees
- shifts
- time_punches

---

### GET /api/employees/:employeeNumber/history?weekStart=YYYY-MM-DD
Get one employee's weekly admin history.

**Access:**
- admin only

**Purpose:**
- return one employee profile
- return one Monday-through-Sunday week of shifts and punches
- return weekly and daily totals
- support previous, current, and next week navigation

**Tables used:**
- employees
- shifts
- time_punches

---

### PATCH /api/employees/:employeeNumber/punches/:punchId
Update one existing punch time for one employee.

**Access:**
- admin only

**Purpose:**
- allow inline correction of an existing punch
- preserve the original punch date while changing only the time
- prevent admins from editing another admin's punches

**Tables used:**
- employees
- shifts
- time_punches

---

### GET /api/employees/me/hours/week
Get the logged-in employee's current weekly hours summary.

**Access:**
- authenticated employee

**Purpose:**
- return current week totals
- return daily totals
- return punch details for the week
- show running hours while an open shift is still active

**Tables used:**
- employees
- shifts
- time_punches

---

## Shift Routes

### POST /api/shifts/start
Begin a new shift for the logged-in employee.

**Access:**
- authenticated employee

**Purpose:**
- create an open shift
- create a `shift_start` punch
- prevent duplicate open shifts

**Tables used:**
- shifts
- time_punches

---

### POST /api/shifts/lunch/start
Clock out for lunch.

**Access:**
- authenticated employee

**Purpose:**
- create a `lunch_start` punch
- require an open shift
- prevent duplicate lunch-start actions

**Tables used:**
- shifts
- time_punches

---

### POST /api/shifts/lunch/end
Clock back in from lunch.

**Access:**
- authenticated employee

**Purpose:**
- create a `lunch_end` punch
- require an open shift
- require the employee to currently be on lunch

**Tables used:**
- shifts
- time_punches

---

### POST /api/shifts/end
End the current shift.

**Access:**
- authenticated employee

**Purpose:**
- create a `shift_end` punch
- mark the shift as completed
- prevent ending a shift while still on lunch

**Tables used:**
- shifts
- time_punches

---

## Validation Notes

The current backend enforces rules such as:
- an employee cannot start a new shift if an open shift already exists
- an employee cannot start lunch without an open shift
- an employee cannot start lunch twice in a row
- an employee cannot end lunch unless they are currently on lunch
- an employee cannot end a shift while still on lunch
- admins can only edit existing punches, not create missing punch records
- admins cannot edit another admin's punches

---

## Future API Expansion Ideas

Possible future backend additions:
- routes for inserting missing punches
- audit history for corrected punch records
- scheduling routes
- manager notes routes
- payroll export routes

These are not part of the current implementation.
