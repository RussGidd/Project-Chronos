import express from "express";
import bcrypt from "bcrypt";
import { getEmployeeByEmployeeNumber } from "../db/queries/employees.js";
import { createToken } from "../utils/jwt.js";

const authRouter = express.Router();

authRouter.post("/login", login);

async function login(request, response) {
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
