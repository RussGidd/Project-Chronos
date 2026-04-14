import { verifyToken } from "../utils/jwt.js";

export function requireUser(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    // WHY: Explicit Bearer validation prevents malformed headers from reaching JWT verification.
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return response.status(401).json({
        error: "A valid Bearer authorization header is required.",
      });
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      // WHY: Empty tokens should fail early with a clear auth error rather than a generic JWT crash path.
      return response.status(401).json({
        error: "A valid Bearer authorization header is required.",
      });
    }

    const user = verifyToken(token);

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({
      error: "Invalid or expired token.",
    });
  }
}
