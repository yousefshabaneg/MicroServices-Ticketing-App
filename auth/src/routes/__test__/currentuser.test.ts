import request from "supertest";
import { app } from "../../app";
import { expect, it } from "vitest";

it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body).toHaveProperty("currentUser");
  expect(response.body.currentUser.email).toEqual("test@test.com");
  expect(response.body.currentUser.id).toBeDefined();
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
