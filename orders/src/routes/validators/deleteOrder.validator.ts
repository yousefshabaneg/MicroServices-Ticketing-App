import { param } from "express-validator";

export const deleteOrderValidator = [
  param("orderId")
    .not()
    .isEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID"),
];
