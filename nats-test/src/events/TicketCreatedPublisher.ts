import { BasePublisher } from "./BasePublisher";
import { Subjects } from "./Subjects";
import { TicketCreatedEvent } from "./TicketCreatedEvent";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
