import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateFieldsMiddleware = (
  req: Request,
  res: Response,
  next: Function
) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json({ msg: err });
  }

  next();
};
