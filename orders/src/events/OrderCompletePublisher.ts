import {
  BasePublisher,
  Subjects,
  OrderCompleteEvent,
} from "@joe-tickets/common";

export class OrderCompletePublisher extends BasePublisher<OrderCompleteEvent> {
  readonly subject = Subjects.OrderComplete;
}
