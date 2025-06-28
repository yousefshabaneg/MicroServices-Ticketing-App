import request from "supertest";
import { app } from "../../app";
import { expect, it, vi } from "vitest";
import mongoose from "mongoose";
import { natsWrapper } from "../../NatsWrapper";
import { Order, OrderStatus } from "../../models/order.model";
import { Ticket } from "../../models/ticket.model";

const createOrder = async (cookie: string) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
};

it("returns a 404 if the order is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", global.signin())
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/orders/${id}`).expect(401);
});

it("returns a 401 if the user does not own the order", async () => {
  const user = global.signin();
  const response = await createOrder(user);
  await request(app)
    .delete(`/api/orders/${response.body.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});

it("marks an order as cancelled", async () => {
  const cookie = global.signin();
  const response = await createOrder(cookie);
  await request(app)
    .delete(`/api/orders/${response.body.id}`)
    .set("Cookie", cookie)
    .expect(204);

  const updatedOrder = await Order.findById(response.body.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await createOrder(cookie);
  await request(app)
    .delete(`/api/orders/${response.body.id}`)
    .set("Cookie", cookie)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
