import { Subjects, BaseListener, OrderCreatedEvent } from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./QueueGroupName";
import { TicketUpdatedPublisher } from "../TicketUpdatedPublsiher";
export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });
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
