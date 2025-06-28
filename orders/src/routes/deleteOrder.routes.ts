import { RequireAuthMiddleware, validateRequest } from "@joe-tickets/common";
import express from "express";
import { DeleteOrderController } from "../controllers/deleteOrder.controller";
import { deleteOrderValidator } from "./validators/deleteOrder.validator";
const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  RequireAuthMiddleware.requireAuth,
  deleteOrderValidator,
  validateRequest,
  DeleteOrderController.deleteOrder
);

export { router as deleteOrderRouter };
