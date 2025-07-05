import {
  BasePublisher,
  Subjects,
  PaymentCreatedEvent,
} from "@joe-tickets/common";

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
