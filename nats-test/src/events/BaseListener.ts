import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./Subjects";

export interface Event {
  subject: Subjects;
  data: any;
}

export abstract class BaseListener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;

  abstract onMessage(data: T["data"], msg: Message): void;
  protected ackWait = 5 * 1000;

  constructor(private client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });

    return subscription;
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
