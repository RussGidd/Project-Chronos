import express from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireUser } from "../middleware/requireUser.js";
import {
  createEmployee,
  getAllEmployees,
  getSafeEmployeeByEmployeeNumber,
} from "../db/queries/employees.js";
import {
  getTodayShiftsByEmployeeNumber,
  getCurrentOpenShiftByEmployeeNumber,
  getRecentShiftsByEmployeeNumber,
} from "../db/queries/shifts.js";
import { getTimePunchesByShiftId } from "../db/queries/timePunches.js";

const employeesRouter = express.Router();

employeesRouter.get("/", requireAdmin, getEmployees);
employeesRouter.post("/", requireAdmin, addEmployee);
employeesRouter.get(
  "/:employeeNumber/history",
  requireAdmin,
  getEmployeeHistory,
);
employeesRouter.get("/me/hours/today", requireUser, getMyHoursToday);

async function getEmployees(request, response) {
  try {
    const employees = await getAllEmployees();

    return response.status(200).json(employees);
  } catch (error) {
    return response.status(500).json({
      error: "Failed to fetch employees.",
    });
  }
}

async function addEmployee(request, response) {
  try {
    const { pin, first_name, nickname, last_name, role, status } = request.body;

    if (!pin || !first_name || !last_name) {
      return response.status(400).json({
        error: "PIN, first name, and last name are required.",
      });
    }

    const employee = await createEmployee({
      pin,
      first_name,
      nickname,
      last_name,
      role,
      status,
    });

    return response.status(201).json(employee);
  } catch (error) {
    return response.status(500).json({
      error: "Failed to create employee.",
    });
  }
}

async function getEmployeeHistory(request, response) {
  try {
    const employeeNumber = Number(request.params.employeeNumber);

    if (!employeeNumber) {
      return response.status(400).json({
        error: "A valid employee number is required.",
      });
    }

    const employee = await getSafeEmployeeByEmployeeNumber(employeeNumber);

    if (!employee) {
      return response.status(404).json({
        error: "Employee not found.",
      });
    }

    const shifts = await getRecentShiftsByEmployeeNumber(employeeNumber);

    const shiftsWithPunches = await Promise.all(
      shifts.map(async function (shift) {
        const timePunches = await getTimePunchesByShiftId(shift.id);

        return {
          ...shift,
          timePunches,
        };
      }),
    );

    return response.status(200).json({
      employee,
      shifts: shiftsWithPunches,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Failed to fetch employee history.",
    });
  }
}

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
