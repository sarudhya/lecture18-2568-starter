// src/middlewares/checkRoleAdminMiddleware.ts
import { type Request, type Response, type NextFunction } from "express";
import { type CustomRequest, type User } from "../libs/types.js";
import { users } from "../db/db.js";

// interface CustomRequest extends Request {
//   user?: any; // Define the user property
//   token?: string; // Define the token property
// }

export const checkStudentId = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. get "user payload" and "token" from (custom) request
  const payload = req.user;
  const token = req.token;
  const Id = req.params.studentId;

  // 2. check if user exists (search with username) and role is ADMIN
  const user = users.find((u: User) => u.username === payload?.username);
  if (payload?.role === "ADMIN") next();
  if (!user || payload?.studentId !== Id) {
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }

  // (optional) check if token exists in user data

  // Proceed to next middleware or route handler
  next();
};

export const checkStudentwNoAdminId = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. get "user payload" and "token" from (custom) request
  const payload = req.user;
  const token = req.token;
  const Id = req.params.studentId;

  // 2. check if user exists (search with username) and role is ADMIN
  const user = users.find((u: User) => u.username === payload?.username);
  if (!user || payload?.studentId !== Id) {
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }

  // (optional) check if token exists in user data

  // Proceed to next middleware or route handler
  next();
};

export const checkStudentofDel = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. get "user payload" and "token" from (custom) request
  const payload = req.user;
  const token = req.token;
  const Id = req.params.studentId;

  // 2. check if user exists (search with username) and role is ADMIN
  const user = users.find((u: User) => u.username === payload?.username);
  if (!user || payload?.studentId !== Id) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to modify another student's data",
    });
  }

  // (optional) check if token exists in user data

  // Proceed to next middleware or route handler
  next();
};