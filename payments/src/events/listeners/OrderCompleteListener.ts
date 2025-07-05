import {
  Subjects,
  BaseListener,
  OrderCompleteEvent,
  OrderStatus,
} from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./QueueGroupName";
import { Order } from "../../models/order.model";

export class OrderCompleteListener extends BaseListener<OrderCompleteEvent> {
  readonly subject = Subjects.OrderComplete;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCompleteEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = OrderStatus.Complete;
    await order.save();

    msg.ack();
  }
}
