import request from "supertest";
import { app } from "../../app";
import { expect, it } from "vitest";
import mongoose from "mongoose";

const createTicket = async (cookie?: string) => {
  const title = "concert";
  const price = 20;
  return await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie || global.signin())
    .send({ title, price });
};

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "new title", price: 100 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "new title", price: 100 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await createTicket();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "new title", price: 100 })
    .expect(401);
});

it("should return a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 100 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: -10 })
    .expect(400);
});

it("update the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});
