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

export async function getThisWeekShiftsByEmployeeNumber(employeeNumber) {
  const SQL = `
    SELECT *
    FROM shifts
    WHERE employee_number = $1
      AND shift_date >= DATE_TRUNC('week', CURRENT_DATE)::date
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

export async function getShiftsByEmployeeNumberAndWeek(
  employeeNumber,
  weekStartDate,
) {
  const SQL = `
    SELECT *
    FROM shifts
    WHERE employee_number = $1
      AND shift_date >= $2::date
      AND shift_date < $2::date + INTERVAL '7 days'
    ORDER BY shift_date ASC, created_at ASC;
  `;

  const result = await db.query(SQL, [employeeNumber, weekStartDate]);
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

export async function getShiftByIdForEmployee(shiftId, employeeNumber) {
  const SQL = `
    SELECT *
    FROM shifts
    WHERE id = $1
      AND employee_number = $2;
  `;

  const result = await db.query(SQL, [shiftId, employeeNumber]);
  return result.rows[0] || null;
}

export async function updateShiftAdminNoteForEmployee(
  shiftId,
  employeeNumber,
  adminNote,
) {
  const SQL = `
    UPDATE shifts
    SET admin_note = $3,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND employee_number = $2
    RETURNING *;
  `;

  const result = await db.query(SQL, [shiftId, employeeNumber, adminNote]);
  return result.rows[0] || null;
}
