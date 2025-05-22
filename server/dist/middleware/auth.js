"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const User_1 = __importDefault(require("../models/User"));
// Protect routes middleware
const protect = async (req, res, next) => {
  let token;
  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    // Check if token exists in cookies
    token = req.cookies.token;
  }
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
    return;
  }
  try {
    // Verify token
    const decoded = (0, jwtUtils_1.verifyToken)(token);
    if (!decoded || typeof decoded === "string" || !("id" in decoded)) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }
    // Get user from the token
    const user = await User_1.default.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};
exports.protect = protect;
// Grant access to specific roles middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
exports.authorize = authorize;
