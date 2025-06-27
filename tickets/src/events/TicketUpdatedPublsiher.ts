import {
  BasePublisher,
  Subjects,
  TicketUpdatedEvent,
} from "@joe-tickets/common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
