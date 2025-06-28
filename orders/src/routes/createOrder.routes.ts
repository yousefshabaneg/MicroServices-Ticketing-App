import { RequireAuthMiddleware } from "@joe-tickets/common";
import express from "express";
import { createOrderValidator } from "./validators/createOrder.validator";
import { validateRequest } from "@joe-tickets/common";
import { CreateOrderController } from "../controllers/createOrder.controller";
const router = express.Router();

router.post(
  "/api/orders",
  RequireAuthMiddleware.requireAuth,
  createOrderValidator,
  validateRequest,
  CreateOrderController.createOrder
);

export { router as createOrderRouter };
