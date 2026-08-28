import IORedis from "ioredis";
import { Queue } from "bullmq";

import { QUEUE_KEY } from "./constants/app.constant";

import env from "./env";

const connection = new IORedis(env.redis.URL, { maxRetriesPerRequest: null });

// => Queue
const workerQueue = new Queue(QUEUE_KEY, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "fixed",
      delay: 1000,
    },
  },
});

export default workerQueue;

// => Could setup queue events here, but this setup all job logs from worker are stored in same application log files

export async function queueCleanup() {
  await workerQueue.close();
  await connection.quit();
}
