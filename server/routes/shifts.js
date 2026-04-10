import express from "express";
import {
  getOpenShiftByEmployeeNumber,
  createShift,
} from "../db/queries/shifts.js";
import { createTimePunch } from "../db/queries/timePunches.js";
import { requireUser } from "../middleware/requireUser.js";

const shiftsRouter = express.Router();

shiftsRouter.post("/start", requireUser, startShift);

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

export default shiftsRouter;
