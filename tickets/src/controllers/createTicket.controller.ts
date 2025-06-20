import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";

class CreateTicketController {
  static createTicket = async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title: title,
      price: price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  };
}

export { CreateTicketController };
