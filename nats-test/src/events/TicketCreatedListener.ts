import { Message } from "node-nats-streaming";
import { BaseListener } from "./BaseListener";
import { Subjects } from "./Subjects";
import { TicketCreatedEvent } from "./TicketCreatedEvent";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event received", data);
    console.log("Event received", data.id);
    console.log("Event received", data.title);
    console.log("Event received", data.price);
    msg.ack();
  }
}
