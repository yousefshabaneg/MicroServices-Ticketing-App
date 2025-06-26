import { Stan } from "node-nats-streaming";
import { Subjects } from "./Subjects";

export interface Event {
  subject: Subjects;
  data: any;
}

export abstract class BasePublisher<T extends Event> {
  abstract subject: T["subject"];
  protected ackWait = 5 * 1000;

  constructor(private client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) return reject(err);
        console.log("Event published to subject", this.subject);
        resolve();
      });
    });
  }
}
