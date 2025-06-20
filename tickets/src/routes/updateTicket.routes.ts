import { RequireAuthMiddleware } from "@joe-tickets/common";
import express from "express";
import { validateRequest } from "@joe-tickets/common";
import { UpdateTicketController } from "../controllers/updateTicket.controller";
import { updateTicketValidator } from "./validators/updateTicket.validator";
const router = express.Router();

router.put(
  "/api/tickets/:id",
  RequireAuthMiddleware.requireAuth,
  updateTicketValidator,
  validateRequest,
  UpdateTicketController.updateTicket
);

export { router as updateTicketRouter };
