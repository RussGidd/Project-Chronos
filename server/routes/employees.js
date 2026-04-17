import express from "express";
import { requireUser } from "../middleware/requireUser.js";
import {
  getTodayShiftsByEmployeeNumber,
  getCurrentOpenShiftByEmployeeNumber,
} from "../db/queries/shifts.js";
import { getTimePunchesByShiftId } from "../db/queries/timePunches.js";

const employeesRouter = express.Router();

employeesRouter.get("/me/hours/today", requireUser, getMyHoursToday);

async function getMyHoursToday(request, response) {
  try {
    const employeeNumber = request.user.employeeNumber;

    const todayShifts = await getTodayShiftsByEmployeeNumber(employeeNumber);
    const currentOpenShift =
      await getCurrentOpenShiftByEmployeeNumber(employeeNumber);

    let shifts = [...todayShifts];

    if (currentOpenShift) {
      const openShiftAlreadyIncluded = shifts.some(function (shift) {
        return shift.id === currentOpenShift.id;
      });

      if (!openShiftAlreadyIncluded) {
        shifts.unshift(currentOpenShift);
      }
    }

    const shiftsWithPunches = await Promise.all(
      shifts.map(async function (shift) {
        const timePunches = await getTimePunchesByShiftId(shift.id);

        let runningHours = 0;

        if (timePunches.length > 0) {
          const firstPunchTime = new Date(timePunches[0].punch_time);
          let endTime = null;

          if (shift.status === "open") {
            endTime = new Date();
          }

          if (shift.status === "completed") {
            const lastPunchTime = new Date(
              timePunches[timePunches.length - 1].punch_time,
            );
            endTime = lastPunchTime;
          }

          if (endTime) {
            const millisecondsWorked = endTime - firstPunchTime;
            const hoursWorked = millisecondsWorked / (1000 * 60 * 60);
            runningHours = Number(hoursWorked.toFixed(2));
          }
        }

        return {
          ...shift,
          timePunches,
          runningHours,
        };
      }),
    );

    const totalHoursToday = shiftsWithPunches.reduce(function (total, shift) {
      return total + shift.runningHours;
    }, 0);

    return response.status(200).json({
      employeeNumber,
      totalHoursToday: Number(totalHoursToday.toFixed(2)),
      shifts: shiftsWithPunches,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to get hours for today.",
    });
  }
}

export default employeesRouter;
