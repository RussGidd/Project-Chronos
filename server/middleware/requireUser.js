import { verifyToken } from "../utils/jwt.js";

export function requireUser(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return response.status(401).json({
        error: "Authorization header is required.",
      });
    }

    const token = authorization.replace("Bearer ", "");

    const user = verifyToken(token);

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({
      error: "Invalid or expired token.",
    });
  }
}
