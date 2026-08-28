import IORedis from "ioredis";

import LoggerService from "../services/logger.service";

import env from "../env";

export const connection = new IORedis(env.redis.URL, {
  maxRetriesPerRequest: null,
});

// [Register Events]
// => Connection Events | This is shared
connection.on("error", (err) => {
  LoggerService.log("error", err.message, {
    error: err as Error,
    data: { group: "WORKER_RUNNING" },
  });

  process.exit(1);
});
