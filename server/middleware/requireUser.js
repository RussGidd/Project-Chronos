import { verifyToken } from "../utils/jwt.js";
import { getEmployeeByEmployeeNumber } from "../db/queries/employees.js";

export async function requireUser(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return response.status(401).json({
        error: "Authorization header is required.",
      });
    }

    const token = authorization.replace("Bearer ", "");

    const user = verifyToken(token);
    const employee = await getEmployeeByEmployeeNumber(user.employeeNumber);

    if (!employee) {
      return response.status(401).json({
        error: "Employee account was not found.",
      });
    }

    if (employee.status !== "active") {
      return response.status(403).json({
        error: "This employee account is inactive.",
      });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({
      error: "Invalid or expired token.",
    });
  }
}
