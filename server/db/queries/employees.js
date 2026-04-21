import db from "../client.js";
import bcrypt from "bcrypt";

export async function getAllEmployees() {
  const SQL = `
    SELECT
      employee_number,
      first_name,
      nickname,
      last_name,
      date_of_hire,
      role,
      status,
      created_at,
      updated_at
    FROM employees
    ORDER BY employee_number;
  `;

  const result = await db.query(SQL);
  return result.rows;
}

export async function createEmployee(employee) {
  const hashedPin = await bcrypt.hash(employee.pin, 10);
  const SQL = `
    INSERT INTO employees (
      pin_hash,
      first_name,
      nickname,
      last_name,
      role,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      employee_number,
      first_name,
      nickname,
      last_name,
      date_of_hire,
      role,
      status,
      created_at,
      updated_at;
  `;

  const values = [
    hashedPin,
    employee.first_name,
    employee.nickname || null,
    employee.last_name,
    employee.role || "employee",
    employee.status || "active",
  ];

  const result = await db.query(SQL, values);
  return result.rows[0];
}

export async function getSafeEmployeeByEmployeeNumber(employeeNumber) {
  const SQL = `
    SELECT
      employee_number,
      first_name,
      nickname,
      last_name,
      date_of_hire,
      role,
      status,
      created_at,
      updated_at
    FROM employees
    WHERE employee_number = $1;
  `;

  const result = await db.query(SQL, [employeeNumber]);
  return result.rows[0] || null;
}

export async function getEmployeeByEmployeeNumber(employeeNumber) {
  const SQL = `
    SELECT *
    FROM employees
    WHERE employee_number = $1;
    `;
  const result = await db.query(SQL, [employeeNumber]);
  return result.rows[0] || null;
}
