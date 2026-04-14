import express from "express";
import { getEmployeeByEmployeeNumber } from "../db/queries/employees.js";
import { comparePin } from "../utils/hashPin.js";
import { createToken } from "../utils/jwt.js";

const authRouter = express.Router();

authRouter.post("/login", login);

async function login(request, response) {
  try {
    // WHY: Normalize and validate auth input early so invalid payloads fail fast with clear feedback.
    const employeeNumber = String(request.body?.employeeNumber ?? "").trim();
    const pin = String(request.body?.pin ?? "").trim();

    if (!employeeNumber || !pin) {
      return response.status(400).json({
        error: "Employee number and PIN are required.",
      });
    }

    const employee = await getEmployeeByEmployeeNumber(employeeNumber);

    const isValidPin = employee ? await comparePin(pin, employee.pin_hash) : false;

    if (!isValidPin) {
      // WHY: Return one generic auth failure message to avoid revealing whether an employee number exists.
      return response.status(401).json({
        error: "Invalid employee number or PIN.",
      });
    }

    const token = createToken({
      employeeNumber: employee.employee_number,
      role: employee.role,
    });

    return response.status(200).json({
      message: "Login successful.",
      token,
      employee: {
        employeeNumber: employee.employee_number,
        firstName: employee.first_name,
        lastName: employee.last_name,
        role: employee.role,
      },
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to log in.",
    });
  }
}

export default authRouter;
