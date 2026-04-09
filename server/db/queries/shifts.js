import db from "../client.js";

export async function getOpenShiftByEmployeeNumber(employeeNumber) {
  const SQL = `
    SELECT *
    FROM shifts
    WHERE employee_number = $1
      AND status = 'open'
    ORDER BY created_at DESC
    LIMIT 1;
`;

  const result = await db.query(SQL, [employeeNumber]);
  return result.rows[0] || null;
}

export async function createShift(employeeNumber) {
  const SQL = `
    INSERT INTO shifts (employee_number)
    VALUES ($1)
    RETURNING *;
`;

  const result = await db.query(SQL, [employeeNumber]);
  return result.rows[0];
}
