# Database Schema

## Overview

Project Chronos is a full-stack timekeeping management application for small businesses. The MVP database is designed to support employee authentication, employee punch actions, hours tracking, and administrator oversight.

The database is centered around employees, admins, and punch records.

---

## Core Tables

### 1. employees

Stores employee account and profile information.

| Column Name | Data Type | Details |
| --- | --- | --- |
| id | SERIAL PRIMARY KEY | Internal database ID |
| employee_number | VARCHAR(5) UNIQUE NOT NULL | 5-digit employee login number |
| pin_hash | TEXT NOT NULL | Hashed 5-digit employee PIN |
| first_name | VARCHAR(50) NOT NULL | Employee first name |
| nickname | VARCHAR(50) | Optional nickname |
| last_name | VARCHAR(50) NOT NULL | Employee last name |
| date_of_hire | DATE NOT NULL | Employee hire date |
| role | VARCHAR(20) NOT NULL DEFAULT 'employee' | Employee role |
| status | VARCHAR(20) NOT NULL DEFAULT 'active' | active, inactive, leave, vacation, medical, restricted |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | Record update timestamp |

---

### 2. admins

Stores administrator login and account information.

| Column Name | Data Type | Details |
| --- | --- | --- |
| id | SERIAL PRIMARY KEY | Internal database ID |
| username | VARCHAR(50) UNIQUE NOT NULL | Admin login name |
| password_hash | TEXT NOT NULL | Hashed admin password |
| first_name | VARCHAR(50) NOT NULL | Admin first name |
| last_name | VARCHAR(50) NOT NULL | Admin last name |
| role | VARCHAR(20) NOT NULL DEFAULT 'admin' | admin, shift_manager, general_manager |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | Record update timestamp |

---

### 3. punch_records

Stores every employee punch action.

| Column Name | Data Type | Details |
| --- | --- | --- |
| id | SERIAL PRIMARY KEY | Internal database ID |
| employee_id | INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE | Employee tied to the punch |
| punch_type | VARCHAR(20) NOT NULL | shift_start, lunch_start, lunch_end, shift_end |
| punch_time | TIMESTAMP NOT NULL | Date and time of the punch |
| entered_by_admin_id | INTEGER REFERENCES admins(id) ON DELETE SET NULL | Admin who created or corrected the punch |
| notes | TEXT | Optional note for manual corrections |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | Record update timestamp |

---

## Table Relationships

- One employee can have many punch records
- One admin can create or correct many punch records
- Punch records belong to exactly one employee
- A punch record may optionally be tied to one admin if it was manually entered or corrected

---

## MVP Design Notes

### Why use punch_records instead of a shifts table?
For the MVP, storing raw punch records is simpler and more flexible. It allows the application to:
- calculate hours from the actual punch history
- show employees their exact punch data
- let admins review and correct individual punch actions
- support future features like edit history and schedule comparisons

### Role handling
The MVP mainly uses:
- employee
- admin

The schema allows future growth if shift_manager and general_manager roles are added later.

### Status handling
The MVP mainly needs:
- active
- inactive

Additional statuses such as leave, vacation, medical, or restricted are included for future expansion.

---

## Future Schema Expansion Ideas

Possible future tables:
- schedules
- employee_notes
- audit_logs
- payroll_exports
- notifications

These are not required for the MVP.
