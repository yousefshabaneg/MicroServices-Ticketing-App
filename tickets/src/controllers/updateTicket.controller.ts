import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { NotAuthorizedError, NotFoundError } from "@joe-tickets/common";

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

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
      },
      { new: true }
    );
    res.status(200).json(updatedTicket);
  };
}

export { UpdateTicketController };
