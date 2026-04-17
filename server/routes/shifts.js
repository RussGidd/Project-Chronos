import express from "express";
import {
  getOpenShiftByEmployeeNumber,
  createShift,
  completeShift,
} from "../db/queries/shifts.js";
import { createTimePunch } from "../db/queries/timePunches.js";
import { requireUser } from "../middleware/requireUser.js";

const shiftsRouter = express.Router();

shiftsRouter.post("/start", requireUser, startShift);
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

export default shiftsRouter;
