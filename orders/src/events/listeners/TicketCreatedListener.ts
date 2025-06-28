import {
  Subjects,
  BaseListener,
  TicketCreatedEvent,
} from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./QueueGroupName";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
