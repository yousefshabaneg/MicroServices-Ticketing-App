import express from "express";
import { signinValidator } from "./validators/signin.validator";
import { SignInController } from "../controllers/signIn.controller";
import { validateRequest } from "../middlewares/validation.middleware";

const router = express.Router();

router.post(
  "/api/users/signin",
  signinValidator,
  validateRequest,
  SignInController.signin
);

export { router as signinRouter };
