import { body } from "express-validator";

export const createOrderValidator = [
  body("ticketId")
    .not()
    .isEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Ticket ID must be a valid MongoDB ID"),
];
