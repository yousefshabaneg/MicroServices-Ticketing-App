import {
  Subjects,
  BaseListener,
  TicketUpdatedEvent,
} from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./QueueGroupName";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
