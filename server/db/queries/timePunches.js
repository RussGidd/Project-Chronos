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
    ORDER BY punch_time ASC;
  `;
  const result = await db.query(SQL, [shiftId]);
  return result.rows;
}
