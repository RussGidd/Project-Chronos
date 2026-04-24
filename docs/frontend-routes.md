# Frontend Structure and View Responsibilities

## Overview

Project Chronos currently uses one role-aware React application centered in `client/src/App.jsx`.

Instead of separate page routes for employees and admins, the current frontend branches by authentication state and employee role:
- logged-out view
- authenticated employee view
- authenticated admin view

This keeps the MVP structure simple, easy to explain, and aligned with the current repo.

---

## Logged-Out Login View

**User type:**
- employee
- admin

**Purpose:**
- provide the main login entry point for the application

**Current responsibilities:**
- collect employee number
- collect PIN
- support on-screen numeric keypad input
- submit login credentials
- display success or validation messages
- present the Project Chronos visual identity on the login screen
- block inactive employee accounts from entering the app

**Notes:**
- this is the shared entry point for both employee and admin users
- the current implementation does not use a separate admin login page

---

## Employee View

**User type:**
- authenticated employee

**Purpose:**
- let employees manage their own shift flow and review their weekly hours

**Current responsibilities:**
- begin shift
- clock out for lunch
- clock in from lunch
- end shift
- view current weekly totals
- view daily totals
- view weekly punch details
- show running time while a shift is still open
- log out

---

## Admin View

**User type:**
- authenticated employee with admin role

**Purpose:**
- let admins manage employee records and review employee timekeeping history

**Current responsibilities:**
- load employee list
- create employee accounts
- display clear create-employee validation and result feedback
- deactivate or reactivate employee accounts
- select an employee from the list
- load one employee's weekly history
- navigate previous, current, and next weeks
- view weekly and daily totals
- view shift and punch history for the selected week
- edit existing punch times inline with confirmation
- log out

---

## Current Frontend Design Notes

- The current frontend is intentionally implemented in a single large `App.jsx` file.
- Role-based branching determines whether the user sees the employee or admin experience.
- The current app does not use React Router.
- The current app does not implement separate dashboard pages for today view, week view, or employee detail routes.

---

## Future Frontend Expansion Ideas

Possible future frontend changes:
- split the single-file app into smaller components
- add route-based navigation if the app grows
- add a stronger kiosk-only mode
- add richer admin reporting views
- add missing-punch creation tools for admins

These are not required by the current implementation.
