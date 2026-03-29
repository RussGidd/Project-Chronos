# Wireframes

## Overview

Project Chronos is designed as a web-based timekeeping management application with two main user experiences:
- employee kiosk experience
- administrator dashboard experience

The wireframes for the MVP focus on clear navigation, simple employee actions, and strong admin visibility.

---

## Planned MVP Screens

### 1. Home / Kiosk Page

**Purpose:**  
This is the main landing page employees use to interact with the system.

**Main elements:**
- current date
- current time
- employee number input
- large on-screen number pad
- action buttons:
  - Begin Shift
  - Clock Out for Lunch
  - Clock In from Lunch
  - End Shift
  - View Hours
- confirmation area for yes or cancel prompts
- admin login button placed lower on the screen

**Design goals:**
- easy to read from a distance
- simple kiosk-style layout
- centered and visually balanced
- fast employee interaction with minimal confusion

---

### 2. Employee Hours Page

**Purpose:**  
Allows an employee to review hours and punch history after authenticating.

**Main elements:**
- employee name
- employee number
- today’s punch summary
- today’s total hours
- current week punch summary
- current week total hours
- back button to return to kiosk page

**Design goals:**
- easy-to-read time records
- clear totals for today and the current week
- simple layout without extra clutter

---

### 3. Admin Login Page

**Purpose:**  
Provides a separate secure login page for administrators.

**Main elements:**
- username input
- password input
- login button
- cancel or return button

**Design goals:**
- clearly separate admin access from employee access
- simple and secure layout
- easy to explain in the capstone pitch

---

### 4. Admin Dashboard - Today View

**Purpose:**  
Shows real-time employee timekeeping activity for the current day.

**Main elements:**
- navigation bar or toggle for Today / Week
- employee table
- employee columns may include:
  - first name
  - nickname
  - last name
  - employee number
  - date of hire
  - current status
  - shift start time
  - lunch out time
  - lunch in time
  - shift end time
  - today total hours
- sorting controls
- search bar if included
- logout button

**Design goals:**
- strong admin visibility
- clean table layout
- easy sorting and quick scanning
- useful for reviewing who is currently working or has punch issues

---

### 5. Admin Dashboard - Week View

**Purpose:**  
Shows employee weekly time totals and punch activity across the work week.

**Main elements:**
- same overall layout as Today View
- columns or expandable sections for Monday through Sunday
- weekly total hours
- sorting options for hours worked, name, or hire date

**Design goals:**
- clear labor comparison across the week
- useful for spotting underworked or overworked employees
- maintain a layout similar to Today View for consistency

---

### 6. Admin Employee Detail Page

**Purpose:**  
Allows admin to review and manage one employee record in more detail.

**Main elements:**
- employee full name
- employee number
- role
- status
- date of hire
- edit employee information button
- reset PIN option
- activate / deactivate option
- punch history table
- add punch button
- edit punch button
- notes area for correction explanation if included
- back button to return to dashboard

**Design goals:**
- detailed employee management in one place
- easy access to punch corrections
- clear separation between profile information and time records

---

## Planned Routes Connected to Wireframes

- `/` → Home / Kiosk Page
- `/hours` → Employee Hours Page
- `/admin/login` → Admin Login Page
- `/admin/dashboard/today` → Admin Dashboard Today View
- `/admin/dashboard/week` → Admin Dashboard Week View
- `/admin/employees/:employeeId` → Admin Employee Detail Page

---

## MVP Wireframe Notes

The MVP wireframes focus on:
- employee speed and simplicity
- admin visibility and control
- clear page responsibilities
- a structure that can be built with React routing and reusable components

The MVP does not require high-fidelity design mockups. Basic layouts, labeled sections, and page structure are enough for the pitch as long as each screen is clearly defined.

---

## Future Wireframe Ideas

Possible future screens or upgrades:
- shift scheduling page
- manager notes panel
- alerts and notifications panel
- payroll export page
- kiosk screensaver state
- mobile-specific layouts

These are not required for the MVP.
