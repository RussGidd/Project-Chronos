import db from "../client.js";

export async function createTimePunch(
  shiftId,
  punchType,
  enteredByEmployeeNumber,
) {
  const SQL = `
    INSERT INTO time_punches (
    shift_id,
    punch_type,
    punch_time,
    entered_by_employee_number
    )
    VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
    RETURNING *;
`;

  const values = [shiftId, punchType, enteredByEmployeeNumber];
  const result = await db.query(SQL, values);

  return result.rows[0];
}

export async function getTimePunchesByShiftId(shiftId) {
  const SQL = `
    SELECT *
    FROM time_punches
    WHERE shift_id = $1
    ORDER BY
      CASE punch_type
        WHEN 'shift_start' THEN 1
        WHEN 'lunch_start' THEN 2
        WHEN 'lunch_end' THEN 3
        WHEN 'shift_end' THEN 4
        ELSE 5
      END,
      punch_time ASC;
  `;
  const result = await db.query(SQL, [shiftId]);
  return result.rows;
}

export async function getEmployeeTimePunchesByShiftId(shiftId) {
  const SQL = `
    SELECT
      id,
      shift_id,
      punch_type,
      punch_time,
      entered_by_employee_number,
      created_at,
      updated_at
    FROM time_punches
    WHERE shift_id = $1
    ORDER BY
      CASE punch_type
        WHEN 'shift_start' THEN 1
        WHEN 'lunch_start' THEN 2
        WHEN 'lunch_end' THEN 3
        WHEN 'shift_end' THEN 4
        ELSE 5
      END,
      punch_time ASC;
  `;

  const result = await db.query(SQL, [shiftId]);
  return result.rows;
}

export async function getLatestTimePunchByShiftId(shiftId) {
  const SQL = `
    SELECT *
    FROM time_punches
    WHERE shift_id = $1
    ORDER BY punch_time DESC
    LIMIT 1;
  `;

  const result = await db.query(SQL, [shiftId]);
  return result.rows[0] || null;
}

export async function updateTimePunchTimeForEmployee(
  punchId,
  employeeNumber,
  hour,
  minute,
  enteredByEmployeeNumber,
) {
  const SQL = `
    UPDATE time_punches
    SET punch_time = DATE_TRUNC('day', punch_time)
        + MAKE_INTERVAL(hours => $3::int, mins => $4::int),
        entered_by_employee_number = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND shift_id IN (
        SELECT id
        FROM shifts
        WHERE employee_number = $2
      )
    RETURNING *;
  `;

  const values = [
    punchId,
    employeeNumber,
    hour,
    minute,
    enteredByEmployeeNumber,
  ];
  const result = await db.query(SQL, values);
  return result.rows[0] || null;
}
