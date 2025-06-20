import { RequireAuthMiddleware } from "@joe-tickets/common";
import express from "express";
import { createTicketValidator } from "./validators/createTicket.validator";
import { validateRequest } from "@joe-tickets/common";
import { CreateTicketController } from "../controllers/createTicket.controller";
const router = express.Router();

router.post(
  "/api/tickets",
  RequireAuthMiddleware.requireAuth,
  createTicketValidator,
  validateRequest,
  CreateTicketController.createTicket
);

export { router as createTicketRouter };
