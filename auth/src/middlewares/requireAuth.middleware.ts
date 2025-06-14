import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/NotAuthorizedError";

class RequireAuthMiddleware {
  static requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }

    next();
  };
}

export { RequireAuthMiddleware };
