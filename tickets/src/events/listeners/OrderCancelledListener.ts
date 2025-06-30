import {
  Subjects,
  BaseListener,
  OrderCancelledEvent,
} from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./QueueGroupName";
import { TicketUpdatedPublisher } from "../TicketUpdatedPublsiher";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
