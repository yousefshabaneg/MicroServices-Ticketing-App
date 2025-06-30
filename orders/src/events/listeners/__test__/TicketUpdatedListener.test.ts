import { expect, it, vi } from "vitest";
import { TicketUpdatedListener } from "../TicketUpdatedListener";
import { natsWrapper } from "../../../NatsWrapper";
import { TicketUpdatedEvent } from "@joe-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
  });

  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = {
    ack: vi.fn(),
  };
  return { listener, ticket, data, msg };
};

it("updates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call the ack if the event has a future version number", async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  await expect(listener.onMessage(data, msg)).rejects.toThrow();
  expect(msg.ack).not.toHaveBeenCalled();
});
