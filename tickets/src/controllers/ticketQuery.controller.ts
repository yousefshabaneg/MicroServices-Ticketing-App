import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { NotFoundError } from "@joe-tickets/common";

class TicketQueryController {
  static getTicketById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }
    res.status(200).json(ticket);
  };
  static getTickets = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
  };
}

export { TicketQueryController };
