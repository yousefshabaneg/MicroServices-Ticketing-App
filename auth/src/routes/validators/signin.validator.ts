import { body } from "express-validator";

export const signinValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").trim().notEmpty().withMessage("Password is required"),
];
