import request from "supertest";
import { app } from "../../app";
import { expect, it, Mock, vi } from "vitest";
import { Order, OrderStatus } from "../../models/order.model";
import { natsWrapper } from "../../NatsWrapper";
import { stripe } from "../../stripe";
import mongoose from "mongoose";

vi.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "tok_visa",
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(400);
});

it("return a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalledWith({
    currency: "usd",
    amount: order.price * 100,
    source: "tok_visa",
  });
  const chargesOptions = (stripe.charges.create as Mock).mock.calls[0][0];
  expect(chargesOptions.currency).toEqual("usd");
  expect(chargesOptions.amount).toEqual(order.price * 100);
  expect(chargesOptions.source).toEqual("tok_visa");
});
