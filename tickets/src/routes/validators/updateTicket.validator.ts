import { body } from "express-validator";

export const updateTicketValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),
];
