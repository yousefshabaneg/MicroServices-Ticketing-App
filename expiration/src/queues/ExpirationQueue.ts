import Queue from "bull";
import { natsWrapper } from "../NatsWrapper";
import { ExpirationCompletePublisher } from "../events/publisher/ExpirationCompletePublisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    "I want to publish an expiration:complete event for orderId: ",
    job.data.orderId
  );
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
  console.log("Expiration complete event published");
});

export { expirationQueue };
