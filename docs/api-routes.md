# API Routes

## Overview

Project Chronos uses a backend API to support employee authentication, employee shift tracking, time punches, hours tracking, and role-based administrator oversight.

The MVP route groups are:
- Auth
- Employees
- Shifts
- Time Punches
- Hours
- Admin

---

## Auth Routes

### POST /api/auth/login
Authenticate an employee using employee number and PIN.

**Request body example:**

    {
      "employeeNumber": 12345,
      "pin": "54321"
    }

**Purpose:**
- verify employee credentials
- return an authentication token
- allow access to employee or admin features based on employee role

**Tables used:**
- employees

---

## Employee Routes

### GET /api/employees/:employeeNumber
Get a single employee profile.

**Purpose:**
- return employee profile data
- support admin employee detail page

**Tables used:**
- employees

---

### GET /api/employees/:employeeNumber/history?weekStart=YYYY-MM-DD
Get one employee's admin history for a single Monday-through-Sunday week.

**Purpose:**
- show the employee profile with one week of shifts and punches
- total the employee's hours for the selected week
- group weekly hours by day
- support previous, current, and next week navigation
- stop previous navigation at the week the employee was created

**Tables used:**
- employees
- shifts
- time_punches

---

### POST /api/employees
Create a new employee account.

**Purpose:**
- allow admin to add a new employee
- store login and profile information
- support the employee creation flow requested in instructor feedback

**Tables used:**
- employees

---

### PATCH /api/employees/:employeeNumber
Update employee information.

**Purpose:**
- allow admin to edit employee details
- allow admin to reset employee PIN
- allow admin to change role
- allow admin to activate or deactivate employees

**Tables used:**
- employees

---

## Shift Routes

### POST /api/shifts
Create a new shift for an employee.

**Request body example:**

    {
      "employeeNumber": 12345,
      "shiftDate": "2026-03-28"
    }

**Purpose:**
- create a new shift record when an employee begins work
- tie future punches to a specific shift

**Tables used:**
- shifts

---

### GET /api/shifts/:employeeNumber/today
Get today’s shifts for one employee.

**Purpose:**
- support employee hours view
- support admin employee detail page
- help identify an employee’s active or completed shift for the day

**Tables used:**
- shifts

---

### GET /api/shifts/:employeeNumber/week
Get current week shifts for one employee.

**Purpose:**
- support weekly hours view
- support weekly admin review

**Tables used:**
- shifts

---

### PATCH /api/shifts/:shiftId
Update a shift record.

**Purpose:**
- allow admin to flag or correct a shift
- allow shift status updates such as open, completed, flagged, or corrected

**Tables used:**
- shifts

---

## Time Punch Routes

### POST /api/time-punches
Create a new time punch for a shift.

**Request body example:**

    {
      "shiftId": 14,
      "punchType": "shift_start",
      "punchTime": "2026-03-28T08:00:00"
    }

**Purpose:**
- record shift start
- record lunch start
- record lunch end
- record shift end
- keep each punch tied to a specific shift

**Tables used:**
- time_punches

---

### GET /api/time-punches/:shiftId
Get all time punches for one shift.

**Purpose:**
- show punch history for one shift
- support admin employee detail page
- include admin-only notes when an admin reviews punch history

**Tables used:**
- time_punches

---

### PATCH /api/employees/:employeeNumber/punches/:timePunchId
Update one time punch for one employee.

**Purpose:**
- allow admin to correct an employee punch time
- prevent admins from editing another admin's punches
- preserve the punch date while changing the hour, minute, and AM or PM

**Tables used:**
- employees
- shifts
- time_punches

---

## Hours Routes

### GET /api/employees/me/hours/week
Get the logged-in employee’s current week shift summary, daily totals, and total weekly hours.

**Purpose:**
- show employee hours for the week starting Monday at midnight
- show daily totals such as Monday, Tuesday, and Wednesday
- show "and counting" when an employee still has an open shift
- support employee hours page
- keep admin-only punch notes out of the employee-facing response

**Tables used:**
- employees
- shifts
- time_punches

---

## Admin Routes

### GET /api/admin/dashboard/today
Get current employee statuses and today’s shift totals.

**Purpose:**
- show all employees on the admin dashboard
- support sorting by hours, hire date, or name
- show whether employees are clocked in, on lunch, or clocked out
- surface possible shift issues for admin review

**Tables used:**
- employees
- shifts
- time_punches

---

### GET /api/admin/dashboard/week
Get employee week totals for the admin dashboard.

**Purpose:**
- show all employee weekly totals
- support labor review and comparison

**Tables used:**
- employees
- shifts
- time_punches

---

### GET /api/admin/employees
Get all employees for admin view.

**Purpose:**
- show sortable employee list
- support dashboard and employee detail navigation

**Tables used:**
- employees

---

## Validation Notes

The backend will also be responsible for enforcing punch and shift rules such as:
- employee cannot start a shift if an open shift already exists
- employee cannot start lunch before starting a shift
- employee cannot end a shift before starting one
- employee cannot start lunch twice in a row
- employee cannot end lunch without first starting lunch
- time punches must belong to a valid shift

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
