import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { NotAuthorizedError, NotFoundError } from "@joe-tickets/common";
import { TicketUpdatedPublisher } from "../events/TicketUpdatedPublsiher";
import { natsWrapper } from "../NatsWrapper";

class UpdateTicketController {
  static updateTicket = async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      userId: ticket.userId,
    });
    res.status(200).json(ticket);
  };
}

export { UpdateTicketController };
