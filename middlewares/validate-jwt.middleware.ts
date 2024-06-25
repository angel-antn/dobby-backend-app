import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateJwtMiddleware = (
  req: Request,
  res: Response,
  next: Function
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_PASSWORD!);

    if (!payload) return res.status(401).json();

    next();
  } catch {
    return res.status(401).json();
  }
};
