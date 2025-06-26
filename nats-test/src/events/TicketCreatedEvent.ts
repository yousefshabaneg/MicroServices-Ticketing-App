import { Event } from "./BaseListener";
import { Subjects } from "./Subjects";

export interface TicketCreatedEvent extends Event {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
