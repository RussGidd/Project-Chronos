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

**Request body:**
```json
{
  "employeeNumber": "12345",
  "pin": "54321"
}
