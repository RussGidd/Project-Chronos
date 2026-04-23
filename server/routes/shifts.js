import express from "express";
import {
  getOpenShiftByEmployeeNumber,
  createShift,
  completeShift,
} from "../db/queries/shifts.js";
import {
  createTimePunch,
  getLatestTimePunchByShiftId,
} from "../db/queries/timePunches.js";
import { requireUser } from "../middleware/requireUser.js";

const shiftsRouter = express.Router();

shiftsRouter.post("/start", requireUser, startShift);
shiftsRouter.post("/lunch/start", requireUser, startLunch);
shiftsRouter.post("/lunch/end", requireUser, endLunch);
shiftsRouter.post("/end", requireUser, endShift);

async function startShift(request, response) {
  try {
    const employeeNumber = request.user.employeeNumber;

    const openShift = await getOpenShiftByEmployeeNumber(employeeNumber);

    if (openShift) {
      return response.status(400).json({
        error: "Employee already has an open shift.",
      });
    }

    const shift = await createShift(employeeNumber);

    const timePunch = await createTimePunch(
      shift.id,
      "shift_start",
      employeeNumber,
    );

    return response.status(201).json({
      message: "Shift started successfully.",
      shift,
      timePunch,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to start shift.",
    });
  }
}

async function endShift(request, response) {
  try {
    const employeeNumber = request.user.employeeNumber;

    const openShift = await getOpenShiftByEmployeeNumber(employeeNumber);

    if (!openShift) {
      return response.status(400).json({
        error: "Employee does not have an open shift.",
      });
    }

    const latestTimePunch = await getLatestTimePunchByShiftId(openShift.id);

    if (latestTimePunch?.punch_type === "lunch_start") {
      return response.status(400).json({
        error: "Employee must end lunch before ending shift.",
      });
    }

    const timePunch = await createTimePunch(
      openShift.id,
      "shift_end",
      employeeNumber,
    );

    const completedShift = await completeShift(openShift.id);

    return response.status(200).json({
      message: "Shift ended successfully.",
      shift: completedShift,
      timePunch,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to end shift.",
    });
  }
}

async function startLunch(request, response) {
  try {
    const employeeNumber = request.user.employeeNumber;

    const openShift = await getOpenShiftByEmployeeNumber(employeeNumber);

    if (!openShift) {
      return response.status(400).json({
        error: "Employee does not have an open shift.",
      });
    }

    const latestTimePunch = await getLatestTimePunchByShiftId(openShift.id);

    if (latestTimePunch?.punch_type === "lunch_start") {
      return response.status(400).json({
        error: "Employee is already on lunch.",
      });
    }

    if (latestTimePunch?.punch_type === "shift_end") {
      return response.status(400).json({
        error: "Cannot start lunch after shift has ended.",
      });
    }

    const timePunch = await createTimePunch(
      openShift.id,
      "lunch_start",
      employeeNumber,
    );

    return response.status(201).json({
      message: "Lunch started successfully.",
      shift: openShift,
      timePunch,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to start lunch.",
    });
  }
}

async function endLunch(request, response) {
  try {
    const employeeNumber = request.user.employeeNumber;

    const openShift = await getOpenShiftByEmployeeNumber(employeeNumber);

    if (!openShift) {
      return response.status(400).json({
        error: "Employee does not have an open shift.",
      });
    }

    const latestTimePunch = await getLatestTimePunchByShiftId(openShift.id);

    if (latestTimePunch?.punch_type !== "lunch_start") {
      return response.status(400).json({
        error: "Employee is not currently on lunch.",
      });
    }

    const timePunch = await createTimePunch(
      openShift.id,
      "lunch_end",
      employeeNumber,
    );

    return response.status(201).json({
      message: "Lunch ended successfully.",
      shift: openShift,
      timePunch,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to end lunch.",
    });
  }
}

export default shiftsRouter;
