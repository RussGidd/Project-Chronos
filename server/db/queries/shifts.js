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

export async function getTodayShiftsByEmployeeNumber(employeeNumber) {
  const SQL = `
    SELECT *
    FROM shifts
    WHERE employee_number = $1
      AND (
        created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
        OR updated_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
      )
    ORDER BY created_at DESC;
  `;

  const result = await db.query(SQL, [employeeNumber]);
  return result.rows;
}

export async function getRecentShiftsByEmployeeNumber(employeeNumber) {
  const SQL = `
    SELECT *
    FROM shifts
    WHERE employee_number = $1
    ORDER BY created_at DESC
    LIMIT 10;
  `;

  const result = await db.query(SQL, [employeeNumber]);
  return result.rows;
}

export async function getCurrentOpenShiftByEmployeeNumber(employeeNumber) {
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

export async function completeShift(shiftId) {
  const SQL = `
    UPDATE shifts
    SET status = 'completed',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const result = await db.query(SQL, [shiftId]);
  return result.rows[0] || null;
}
