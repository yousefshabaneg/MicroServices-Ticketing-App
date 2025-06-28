import request from "supertest";
import { app } from "../../app";
import { describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket.model";
import { Order, OrderStatus } from "../../models/order.model";

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

describe("get order by id", () => {
  it("should return 404 if the order is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .get(`/api/orders/${id}`)
      .set("Cookie", global.signin())
      .expect(404);
  });

  it("should return the order if it is found", async () => {
    const user = global.signin();
    const { body: order } = await createOrder(user);

    const { body: orderResponse } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .expect(200);
    expect(orderResponse.id).toEqual(order.id);
  });

  it("should return 401 if the user is not the owner of the order", async () => {
    const user = global.signin();
    const { body: order } = await createOrder(user);
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", global.signin())
      .expect(401);
  });
});

describe("get orders", () => {
  it("fetches orders for a particular user", async () => {
    const userOne = global.signin();
    const userTwo = global.signin();

    const { body: orderOne } = await createOrder(userOne);

    const { body: orderTwo } = await createOrder(userTwo);
    const { body: orderThree } = await createOrder(userTwo);

    const responseUserOne = await request(app)
      .get("/api/orders")
      .set("Cookie", userOne)
      .expect(200);

    const responseUserTwo = await request(app)
      .get("/api/orders")
      .set("Cookie", userTwo)
      .expect(200);

    expect(responseUserOne.body.length).toEqual(1);
    expect(responseUserOne.body[0].id).toEqual(orderOne.id);

    expect(responseUserTwo.body.length).toEqual(2);
    expect(responseUserTwo.body[0].id).toEqual(orderTwo.id);
    expect(responseUserTwo.body[1].id).toEqual(orderThree.id);
  });
});
