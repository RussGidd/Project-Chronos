import db from "../client.js";

export async function getEmployeeByEmployeeNumber(employeeNumber) {
  const SQL = `
    SELECT *
    FROM employees
    WHERE employee_number = $1;
    `;
  const result = await db.query(SQL, [employeeNumber]);
  return result.rows[0] || null;
}
