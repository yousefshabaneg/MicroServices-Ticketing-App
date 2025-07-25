import request from "supertest";
import { app } from "../../app";
import { expect, it } from "vitest";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("should return a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test",
      password: "password",
    })
    .expect(400);
});

it("should return a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("should return a 400 with missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("should return error for duplicate email", async () => {
  const email = "user@example.com";
  const password = "myStrongPassword123";

  await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(Array.isArray(response.body.errors)).toBe(true);

  const hasEmailInUseError = response.body.errors.some((err: any) =>
    err.message.toLowerCase().includes("email")
  );

  expect(hasEmailInUseError).toBe(true);
});

it("should set a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
