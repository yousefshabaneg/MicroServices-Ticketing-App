import request from "supertest";
import { app } from "../../app";
import { describe, expect, it } from "vitest";
import mongoose from "mongoose";

const createTicket = async () => {
  const title = "concert";
  const price = 20;
  return await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price });
};

describe("get ticket by id", () => {
  it("should return 404 if the ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
  });

  it("should return the ticket if it is found", async () => {
    const response = await createTicket();

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .expect(200);

    expect(ticketResponse.body.title).toEqual(response.body.title);
    expect(ticketResponse.body.price).toEqual(response.body.price);
  });
});

describe("get tickets", () => {
  it("should return all tickets", async () => {
    await createTicket();
    await createTicket();

    const response = await request(app).get("/api/tickets").expect(200);

    expect(response.body.length).toEqual(2);
  });
});
