import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  res.status(400).json({ errors: [{ message: "Something went wrong" }] });
};
