import express from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireUser } from "../middleware/requireUser.js";
import {
  createEmployee,
  deleteEmployeeByEmployeeNumber,
  getAllEmployees,
  getSafeEmployeeByEmployeeNumber,
} from "../db/queries/employees.js";
import {
  getShiftsByEmployeeNumberAndWeek,
  getThisWeekShiftsByEmployeeNumber,
} from "../db/queries/shifts.js";
import {
  getEmployeeTimePunchesByShiftId,
  getTimePunchByIdForEmployee,
  getTimePunchesByShiftId,
  updateTimePunchTimeForEmployee,
} from "../db/queries/timePunches.js";

const employeesRouter = express.Router();

employeesRouter.get("/", requireAdmin, getEmployees);
employeesRouter.post("/", requireAdmin, addEmployee);
employeesRouter.delete("/:employeeNumber", requireAdmin, removeEmployee);
employeesRouter.get(
  "/:employeeNumber/history",
  requireAdmin,
  getEmployeeHistory,
);
employeesRouter.patch(
  "/:employeeNumber/punches/:punchId",
  requireAdmin,
  updateEmployeePunch,
);
employeesRouter.get("/me/hours/week", requireUser, getMyHoursThisWeek);

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

async function removeEmployee(request, response) {
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

    if (employee.employee_number === request.user.employeeNumber) {
      return response.status(403).json({
        error: "Admins cannot delete their own account.",
      });
    }

    if (employee.role === "admin") {
      return response.status(403).json({
        error: "Admins cannot delete another admin account.",
      });
    }

    const deletedEmployee = await deleteEmployeeByEmployeeNumber(
      employeeNumber,
    );

    return response.status(200).json({
      message: `Employee deleted: ${deletedEmployee.first_name} ${deletedEmployee.last_name}`,
      employee: deletedEmployee,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Failed to delete employee.",
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

    const currentWeekStart = getWeekStartDate(new Date());
    const requestedWeekStart = request.query.weekStart
      ? getWeekStartDate(new Date(`${request.query.weekStart}T00:00:00`))
      : currentWeekStart;
    const employeeCreatedWeekStart = getWeekStartDate(
      new Date(employee.created_at),
    );

    let selectedWeekStart = requestedWeekStart;

    if (selectedWeekStart < employeeCreatedWeekStart) {
      selectedWeekStart = employeeCreatedWeekStart;
    }

    if (selectedWeekStart > currentWeekStart) {
      selectedWeekStart = currentWeekStart;
    }

    const shifts = await getShiftsByEmployeeNumberAndWeek(
      employeeNumber,
      selectedWeekStart,
    );

    const shiftsWithPunches = await Promise.all(
      shifts.map(async function (shift) {
        const timePunches = await getTimePunchesByShiftId(shift.id);
        const runningHours = calculateWorkedHours(shift, timePunches);

        return {
          ...shift,
          timePunches,
          runningHours,
        };
      }),
    );
    const totalHoursThisWeek = shiftsWithPunches.reduce(function (total, shift) {
      return total + shift.runningHours;
    }, 0);
    const dailyTotals = buildDailyTotals(shiftsWithPunches);
    const isRunning = shiftsWithPunches.some(function (shift) {
      return shift.status === "open";
    });
    const previousWeekStart = addDays(selectedWeekStart, -7);
    const nextWeekStart = addDays(selectedWeekStart, 7);
    const canViewPrevious = previousWeekStart >= employeeCreatedWeekStart;
    const canViewNext = nextWeekStart <= currentWeekStart;

    return response.status(200).json({
      employee,
      week: {
        weekStart: selectedWeekStart,
        weekEnd: addDays(selectedWeekStart, 6),
        currentWeekStart,
        previousWeekStart: canViewPrevious ? previousWeekStart : null,
        nextWeekStart: canViewNext ? nextWeekStart : null,
        canViewPrevious,
        canViewNext,
      },
      totalHoursThisWeek: Number(totalHoursThisWeek.toFixed(2)),
      isRunning,
      dailyTotals,
      shifts: shiftsWithPunches,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Failed to fetch employee history.",
    });
  }
}

async function getMyHoursThisWeek(request, response) {
  try {
    const employeeNumber = request.user.employeeNumber;
    const currentWeekStart = getWeekStartDate(new Date());

    const weekShifts = await getThisWeekShiftsByEmployeeNumber(employeeNumber);

    const shiftsWithPunches = await Promise.all(
      weekShifts.map(async function (shift) {
        const timePunches = await getEmployeeTimePunchesByShiftId(shift.id);
        const runningHours = calculateWorkedHours(shift, timePunches);

        return {
          ...shift,
          timePunches,
          runningHours,
        };
      }),
    );

    const totalHoursThisWeek = shiftsWithPunches.reduce(function (total, shift) {
      return total + shift.runningHours;
    }, 0);
    const dailyTotals = buildDailyTotals(shiftsWithPunches);
    const isRunning = shiftsWithPunches.some(function (shift) {
      return shift.status === "open";
    });

    return response.status(200).json({
      employeeNumber,
      week: {
        weekStart: currentWeekStart,
        weekEnd: addDays(currentWeekStart, 6),
      },
      totalHoursThisWeek: Number(totalHoursThisWeek.toFixed(2)),
      isRunning,
      dailyTotals,
      shifts: shiftsWithPunches,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to get hours for this week.",
    });
  }
}

async function updateEmployeePunch(request, response) {
  try {
    const employeeNumber = Number(request.params.employeeNumber);
    const punchId = Number(request.params.punchId);
    const { hour, minute, period, timezoneOffsetMinutes } = request.body;

    if (!employeeNumber || !punchId) {
      return response.status(400).json({
        error: "A valid employee number and punch ID are required.",
      });
    }

    const employee = await getSafeEmployeeByEmployeeNumber(employeeNumber);

    if (!employee) {
      return response.status(404).json({
        error: "Employee not found.",
      });
    }

    if (
      employee.role === "admin" &&
      employee.employee_number !== request.user.employeeNumber
    ) {
      return response.status(403).json({
        error: "Admins cannot edit another admin's punches.",
      });
    }

    const hourNumber = Number(hour);
    const minuteNumber = Number(minute);
    const timezoneOffsetNumber = Number(timezoneOffsetMinutes);

    if (
      !Number.isInteger(hourNumber) ||
      hourNumber < 1 ||
      hourNumber > 12 ||
      !Number.isInteger(minuteNumber) ||
      minuteNumber < 0 ||
      minuteNumber > 59 ||
      !["AM", "PM"].includes(period) ||
      !Number.isInteger(timezoneOffsetNumber) ||
      timezoneOffsetNumber < -840 ||
      timezoneOffsetNumber > 840
    ) {
      return response.status(400).json({
        error: "Enter a valid hour, minute, AM or PM, and timezone offset.",
      });
    }

    let hourForDatabase = hourNumber;

    if (period === "AM" && hourForDatabase === 12) {
      hourForDatabase = 0;
    }

    if (period === "PM" && hourForDatabase !== 12) {
      hourForDatabase += 12;
    }

    const existingTimePunch = await getTimePunchByIdForEmployee(
      punchId,
      employeeNumber,
    );

    if (!existingTimePunch) {
      return response.status(404).json({
        error: "Punch not found for this employee.",
      });
    }

    const updatedPunchTime = buildUpdatedPunchTime(
      existingTimePunch.punch_time,
      hourForDatabase,
      minuteNumber,
      timezoneOffsetNumber,
    );

    const timePunch = await updateTimePunchTimeForEmployee(
      punchId,
      employeeNumber,
      updatedPunchTime,
      request.user.employeeNumber,
    );

    return response.status(200).json({
      message: "Punch updated successfully.",
      timePunch,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to update punch.",
    });
  }
}

function buildDailyTotals(shifts) {
  const totalsByDate = {};

  shifts.forEach(function (shift) {
    const dateKey = getDateKey(shift.shift_date);
    const date = new Date(`${dateKey}T00:00:00`);

    if (!totalsByDate[dateKey]) {
      totalsByDate[dateKey] = {
        date: dateKey,
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        totalHours: 0,
        isRunning: false,
      };
    }

    totalsByDate[dateKey].totalHours += shift.runningHours;

    if (shift.status === "open") {
      totalsByDate[dateKey].isRunning = true;
    }
  });

  return Object.values(totalsByDate)
    .map(function (day) {
      return {
        ...day,
        totalHours: Number(day.totalHours.toFixed(2)),
      };
    })
    .sort(function (firstDay, secondDay) {
      return firstDay.date.localeCompare(secondDay.date);
    });
}

function getWeekStartDate(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);

  const daysSinceMonday = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - daysSinceMonday);

  return getDateKey(date);
}

function addDays(dateValue, numberOfDays) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + numberOfDays);

  return getDateKey(date);
}

function getDateKey(dateValue) {
  if (typeof dateValue === "string") {
    return dateValue.slice(0, 10);
  }

  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateWorkedHours(shift, timePunches) {
  let workedMilliseconds = 0;
  let activeWorkStart = null;

  timePunches.forEach(function (punch) {
    const punchTime = new Date(punch.punch_time);

    if (punch.punch_type === "shift_start") {
      activeWorkStart = punchTime;
    }

    if (punch.punch_type === "lunch_start" && activeWorkStart) {
      workedMilliseconds += punchTime - activeWorkStart;
      activeWorkStart = null;
    }

    if (punch.punch_type === "lunch_end") {
      activeWorkStart = punchTime;
    }

    if (punch.punch_type === "shift_end" && activeWorkStart) {
      workedMilliseconds += punchTime - activeWorkStart;
      activeWorkStart = null;
    }
  });

  if (shift.status === "open" && activeWorkStart) {
    workedMilliseconds += new Date() - activeWorkStart;
  }

  const hoursWorked = workedMilliseconds / (1000 * 60 * 60);
  return Number(hoursWorked.toFixed(2));
}

function buildUpdatedPunchTime(
  existingPunchTime,
  hour,
  minute,
  timezoneOffsetMinutes,
) {
  const existingUtcPunchTime = new Date(existingPunchTime);
  const existingLocalPunchTime = new Date(
    existingUtcPunchTime.getTime() - timezoneOffsetMinutes * 60 * 1000,
  );

  const localYear = existingLocalPunchTime.getUTCFullYear();
  const localMonth = existingLocalPunchTime.getUTCMonth();
  const localDay = existingLocalPunchTime.getUTCDate();

  return new Date(
    Date.UTC(localYear, localMonth, localDay, hour, minute) +
      timezoneOffsetMinutes * 60 * 1000,
  );
}

export default employeesRouter;
