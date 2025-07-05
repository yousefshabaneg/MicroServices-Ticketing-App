import { body } from "express-validator";

export const createChargeValidator = [
  body("token").notEmpty().withMessage("Token is required"),
  body("orderId").notEmpty().withMessage("Order ID is required"),
];
