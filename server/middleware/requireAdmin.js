import { requireUser } from "./requireUser.js";

export function requireAdmin(request, response, next) {
  requireUser(request, response, function () {
    if (request.user.role !== "admin") {
      return response.status(403).json({
        error: "Admin access is required.",
      });
    }

    next();
  });
}
