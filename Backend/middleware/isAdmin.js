import { errorHandler } from "../utils/error.js";

export const isAdmin = (req, res, next) => {
  try {
    // Check if req.user exists and has the role property
    if (!req.user || req.user.role !== "admin") {
      return next(errorHandler(403, "Access denied. Admins only."));
    }
    next(); // User is an admin, proceed to the next middleware/controller
  } catch (error) {
    return next(errorHandler(500, "Server error"));
  }
};