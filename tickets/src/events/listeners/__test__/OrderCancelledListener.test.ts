import { expect, it, Mock, vi } from "vitest";
import { natsWrapper } from "../../../NatsWrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";
import { OrderCancelledListener } from "../OrderCancelledListener";
import { OrderCancelledEvent, OrderStatus } from "@joe-tickets/common";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: vi.fn(),
  };
  return { listener, ticket, data, msg };
};

it("sets the orderId of the ticket to undefined", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).toBeUndefined();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as Mock).mock.calls[0][1]
  );
  expect(ticketUpdatedData.orderId).toBeUndefined();
});
