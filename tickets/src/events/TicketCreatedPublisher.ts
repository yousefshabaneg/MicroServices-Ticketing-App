import {
  BasePublisher,
  Subjects,
  TicketCreatedEvent,
} from "@joe-tickets/common";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
