# Build Order Plan

## Overview

This document outlines the recommended development order for Project Chronos after the pitch is approved.

The goal is to build the application in a logical order so that each completed part supports the next stage of development.

---

## Recommended Build Order

### 1. Project Setup
Set up the basic project structure for the application.

Tasks:
- create client and server folders
- initialize frontend and backend
- install core dependencies
- connect project to GitHub
- set up environment variables
- confirm frontend and backend can both run locally

Why first:
This creates the foundation for all remaining work.

---

### 2. Database Setup
Build the PostgreSQL database structure.

Tasks:
- create database
- write schema.sql or JavaScript schema setup
- create tables
- define relationships
- seed basic admin and employee test data

Why second:
The backend routes and authentication depend on the database being ready.

---

### 3. Backend Server Setup
Set up the Express server and API structure.

Tasks:
- create Express app
- add JSON middleware
- organize route files
- organize database query files
- add basic error handling

Why third:
This creates the API structure before feature logic is added.

---

### 4. Authentication
Build employee and admin login systems.

Tasks:
- employee login with employee number and PIN
- admin login with username and password
- token creation
- protected route middleware
- authentication testing

Why fourth:
Authentication controls access to employee and admin features.

---

### 5. Employee Punch Actions
Build the core timekeeping actions.

Tasks:
- begin shift
- clock out for lunch
- clock in from lunch
- end shift
- save punch records to database
- return success or validation messages

Why fifth:
This is the heart of the MVP and should work before dashboards are built.

---

### 6. Employee Hours Page
Build the employee hours view.

Tasks:
- fetch current week punch records
- calculate total hours
- group weekly hours by day
- display running totals if employee is still clocked in

Why sixth:
Once punches exist, employees need a way to review their hours.

---

### 7. Admin Dashboard
Build the admin oversight pages.

Tasks:
- today view
- week view
- employee list
- current status display
- sorting controls
- navigation to employee detail page

Why seventh:
This builds on data already created by employee activity.

---

### 8. Admin Employee Detail Page
Build detailed admin employee management.

Tasks:
- show employee profile
- show weekly hour totals
- group weekly hours by day
- add previous, current, and next week navigation
- show punch history for the selected week
- allow employee edits
- allow PIN reset
- allow activate/deactivate
- allow punch correction

Why eighth:
This is important admin functionality, but it depends on earlier systems already working.

---

### 9. Validation and Edge Cases
Strengthen business rules and handle bad input.

Tasks:
- prevent invalid punch order
- handle missing lunch actions
- handle duplicate actions
- show useful error messages
- support admin correction flow

Why ninth:
Validation is easier to build once the main flow already works.

---

### 10. Styling and UI Polish
Improve presentation and usability.

Tasks:
- style kiosk page
- style hours page
- style admin pages
- improve layout consistency
- improve button and table readability

Why tenth:
The app should work before time is spent polishing visuals.

---

### 11. Testing and Bug Fixing
Review the application and fix problems.

Tasks:
- test all employee flows
- test all admin flows
- test route protection
- test sorting and calculations
- fix bugs and edge cases

Why eleventh:
This step improves reliability before deployment.

---

### 12. Deployment Preparation
Prepare the project for deployment and presentation.

Tasks:
- choose deployment services
- configure environment variables
- deploy frontend and backend
- test deployed application
- prepare capstone presentation materials

Why twelfth:
Deployment should happen after the app is functional and tested.

---

## MVP Build Priorities

If time becomes limited, priority order should be:

1. employee authentication
2. employee punch actions
3. employee hours page
4. admin authentication
5. admin dashboard
6. admin employee detail page
7. validation improvements
8. styling polish

---

## Scope Control Notes

If the project needs to be reduced in scope, keep the following as MVP:
- employee login
- employee punch actions
- employee hours page
- admin login
- admin dashboard
- basic punch correction

Move the following to stretch goals if necessary:
- advanced search
- expanded role hierarchy
- leave and restriction statuses
- screensaver behavior
- advanced visual alerts
- scheduling logic
- payroll export
