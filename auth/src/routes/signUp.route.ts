import express from "express";
import { signupValidator } from "./validators/signup.validator";
import { validateRequest } from "../middlewares/validation.middleware";
import { SignUpController } from "../controllers/signUp.controller";

const router = express.Router();

router.post(
  "/api/users/signup",
  signupValidator,
  validateRequest,
  SignUpController.signup
);

export { router as signupRouter };
