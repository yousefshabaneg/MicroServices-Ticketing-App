import { Subjects, BaseListener, OrderCreatedEvent } from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./QueueGroupName";
import { expirationQueue } from "../../queues/ExpirationQueue";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
