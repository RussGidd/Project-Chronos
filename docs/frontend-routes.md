# Frontend Routes and Page Responsibilities

## Overview

Project Chronos is planned as a React-based web application with two main user flows:
- employee kiosk flow
- administrator dashboard flow

The MVP route plan separates employee-facing pages from admin-facing pages so the application is easier to understand, explain, and build.

---

## Route List

## Home / Kiosk Page
**Route:** `/`

**User type:**  
Employee-facing primary page

**Purpose:**  
This is the main page employees use to interact with the system.

**Responsibilities:**
- display current date and time
- allow employee number entry
- display large on-screen number pad
- allow employee to choose:
  - Begin Shift
  - Clock Out for Lunch
  - Clock In from Lunch
  - End Shift
  - View Hours
- display confirmation prompts such as yes or cancel
- provide access to admin login

**Notes:**
- this page should be fast and simple
- this page acts like a kiosk screen, not a traditional employee dashboard

---

## Employee Hours Page
**Route:** `/hours`

**User type:**  
Employee-facing authenticated page

**Purpose:**  
Allows an employee to view their hours and punch history.

**Responsibilities:**
- show employee name and employee number
- show today’s punch history
- show today’s total hours
- show current week punch history
- show current week total hours
- allow return to the kiosk page

**Notes:**
- access should require successful employee authentication
- this page should only show the logged-in employee’s information

---

## Admin Login Page
**Route:** `/admin/login`

**User type:**  
Administrator

**Purpose:**  
Provides a secure login page for admin access.

**Responsibilities:**
- allow admin username entry
- allow admin password entry
- submit admin login credentials
- route successful admin login to the admin dashboard
- allow return to the kiosk page

**Notes:**
- this page is intentionally separate from employee login flow
- this keeps the employee experience simple and the admin experience secure

---

## Admin Dashboard Today View
**Route:** `/admin/dashboard/today`

**User type:**  
Administrator

**Purpose:**  
Shows employee activity and hours for the current day.

**Responsibilities:**
- show all employees in a table or list
- display current employee status
- display today’s punches
- display today’s running or completed hours
- allow sorting by:
  - hours worked
  - date of hire
  - name
- allow navigation to a specific employee detail page
- allow navigation to week view
- allow logout

**Notes:**
- this page is the main admin control center for real-time daily oversight

---

## Admin Dashboard Week View
**Route:** `/admin/dashboard/week`

**User type:**  
Administrator

**Purpose:**  
Shows employee weekly hour totals and work patterns.

**Responsibilities:**
- show all employees in a table or list
- display weekly punch breakdown
- display weekly total hours
- allow sorting by:
  - weekly hours worked
  - date of hire
  - name
- allow navigation to a specific employee detail page
- allow navigation back to today view
- allow logout

**Notes:**
- this page supports the long-term idea of fairer labor review
- scheduling logic itself is not part of the MVP

---

## Admin Employee Detail Page
**Route:** `/admin/employees/:employeeId`

**User type:**  
Administrator

**Purpose:**  
Allows admin to review one employee record in detail.

**Responsibilities:**
- show employee profile details
- show employee status and role
- show employee date of hire
- show employee punch history
- allow admin to:
  - edit employee profile information
  - reset employee PIN
  - activate or deactivate employee
  - add a punch record
  - edit or correct a punch record
- allow return to dashboard

**Notes:**
- this page is where employee management and punch correction happen

---

## Route Protection Notes

### Employee-Protected Route
- `/hours`

This route should require valid employee authentication.

### Admin-Protected Routes
- `/admin/dashboard/today`
- `/admin/dashboard/week`
- `/admin/employees/:employeeId`

These routes should require valid admin authentication.

---

## MVP Route Design Goals

The MVP route structure is designed to:
- keep employee actions fast and simple
- keep admin functions clearly separated
- make the application easy to explain in the project pitch
- support reusable React components and predictable navigation

---

## Future Route Ideas

Possible future routes:
- `/admin/schedules`
- `/admin/alerts`
- `/admin/payroll`
- `/employee/profile`
- `/employee/history`

These are not required for the MVP.
