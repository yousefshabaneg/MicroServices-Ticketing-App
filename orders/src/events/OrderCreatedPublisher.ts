import {
  BasePublisher,
  Subjects,
  OrderCreatedEvent,
} from "@joe-tickets/common";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
