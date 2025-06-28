import express from "express";
import { OrderQueryController } from "../controllers/orderQuery.controller";
import { RequireAuthMiddleware } from "@joe-tickets/common";
const router = express.Router();

router.get(
  "/api/orders/:orderId",
  RequireAuthMiddleware.requireAuth,
  OrderQueryController.getOrderById
);
router.get(
  "/api/orders",
  RequireAuthMiddleware.requireAuth,
  OrderQueryController.getOrders
);

export { router as orderQueryRouter };
