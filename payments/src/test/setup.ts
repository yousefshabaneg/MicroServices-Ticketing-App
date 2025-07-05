import { beforeAll, beforeEach, afterAll, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (userId?: string) => string[];
}

vi.mock("../NatsWrapper");

let mongo: MongoMemoryServer;
process.env.STRIPE_KEY =
  "sk_test_51MU6lZHx5OIKmdZczHzkheOBYhb9e9wrlHwgJvu9Ufy7wYMGUswljz03LZfzmmwgk25EMpFOImAqL91cpDGxiVCT006keIAl4f";

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Optional, if using https in test env

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});
beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  for (let collection of collections || []) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

// 👇 Global signin function
globalThis.signin = (userId?: string) => {
  const payload = {
    id: userId || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
