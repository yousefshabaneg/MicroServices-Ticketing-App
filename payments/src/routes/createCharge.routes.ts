import { RequireAuthMiddleware } from "@joe-tickets/common";
import express from "express";
import { createChargeValidator } from "./validators/createCharge.validator";
import { validateRequest } from "@joe-tickets/common";
import { CreateChargeController } from "../controllers/createCharge.controller";
const router = express.Router();

router.post(
  "/api/payments",
  RequireAuthMiddleware.requireAuth,
  createChargeValidator,
  validateRequest,
  CreateChargeController.createCharge
);

export { router as createChargeRouter };
