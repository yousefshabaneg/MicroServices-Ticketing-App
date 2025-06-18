import express from "express";
import { signinValidator } from "./validators/signin.validator";
import { SignInController } from "../controllers/signIn.controller";
import { validateRequest } from "@joe-tickets/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  signinValidator,
  validateRequest,
  SignInController.signin
);

export { router as signinRouter };
