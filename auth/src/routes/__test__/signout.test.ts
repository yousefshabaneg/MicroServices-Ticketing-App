import request from "supertest";
import { app } from "../../app";
import { expect, it } from "vitest";

it("should clear the cookie after successful signout", async () => {
  await global.signin();

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
  expect(response.get("Set-Cookie")?.[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
