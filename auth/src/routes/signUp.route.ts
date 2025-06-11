import express, { Request, Response } from "express";
import { signupValidator } from "./validators/signup.validator";
import { validateRequest } from "../middlewares/validation.middleware";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError";

const router = express.Router();

router.post(
  "/api/users/signup",
  signupValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (1 == 1) throw new DatabaseConnectionError();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        email,
      },
    });
  }
);

export { router as signupRouter };
