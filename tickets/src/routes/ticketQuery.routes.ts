import express from "express";
import { TicketQueryController } from "../controllers/ticketQuery.controller";
const router = express.Router();

router.get("/api/tickets/:id", TicketQueryController.getTicketById);
router.get("/api/tickets", TicketQueryController.getTickets);

export { router as ticketQueryRouter };
