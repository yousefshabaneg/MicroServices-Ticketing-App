import {
  BasePublisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@joe-tickets/common";

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
