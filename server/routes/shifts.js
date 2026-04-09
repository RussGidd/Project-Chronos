import express from "express";
import bcrypt from "bcrypt";
import { getEmployeeByEmployeeNumber } from "../db/queries/employees.js";
import {
  getOpenShiftByEmployeeNumber,
  createShift,
} from "../db/queries/shifts.js";
import { createTimePunch } from "../db/queries/timePunches.js";

const shiftsRouter = express.Router();

shiftsRouter.post("/start", startShift);

async function startShift(request, response) {
  try {
    const { employeeNumber, pin } = request.body;

    if (!employeeNumber || !pin) {
      return response.status(400).json({
        error: "Employee number and PIN are required.",
      });
    }
    const employee = await getEmployeeByEmployeeNumber(employeeNumber);

    if (!employee) {
      return response.status(404).json({
        error: "Employee not found.",
      });
    }

    const isValidPin = await bcrypt.compare(pin, employee.pin_hash);

    if (!isValidPin) {
      return response.status(401).json({
        error: "Invalid PIN.",
      });
    }

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
