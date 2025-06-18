import request from "supertest";
import { app } from "../../app";
import { expect, it } from "vitest";

it("returns a 200 on successful signin", async () => {
  await global.signin();

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
});

it("should return a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test",
      password: "password",
    })
    .expect(400);
});

it("should return a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("should return a 400 with missing email and password", async () => {
  return request(app).post("/api/users/signin").send({}).expect(400);
});

it("should return error for not existing email", async () => {
  const email = "user@example.com";
  const password = "myStrongPassword123";

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email, password })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(Array.isArray(response.body.errors)).toBe(true);

  const hasEmailInUseError = response.body.errors.some((err: any) =>
    err.message.toLowerCase().includes("credentials")
  );

  expect(hasEmailInUseError).toBe(true);
});

it("should set a cookie after successful signin", async () => {
  await global.signin();

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
