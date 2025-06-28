import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { TicketCreatedPublisher } from "../events/TicketCreatedPublisher";
import { natsWrapper } from "../NatsWrapper";
class CreateTicketController {
  static createTicket = async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title: title,
      price: price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      userId: ticket.userId,
    });
    res.status(201).json(ticket);
  };
}

export { CreateTicketController };
