import {
  BasePublisher,
  Subjects,
  OrderCancelledEvent,
} from "@joe-tickets/common";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
