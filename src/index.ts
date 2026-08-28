import "reflect-metadata";
import { bootstrapMicroframework } from "microframework-w3tec";

import LoggerService from "./services/logger.service";

import { redisLoader, typeOrmLoader, expressLoader } from "./loaders";

bootstrapMicroframework({
  loaders: [typeOrmLoader, redisLoader, expressLoader],
})
  .then((framework) => {
    ["SIGTERM", "SIGINT", "SIGUSR2"].map((signalType) => {
      process.once(signalType, async () => {
        try {
          await framework.shutdown();
        } catch (error) {
          LoggerService.log("error", "Graceful shutdown failed", {
            error: error as Error,
            data: { group: "APP_SHUTDOWN" },
          });

          process.exitCode = 1;
        }
      });
    });
  })
  .catch((error) => {
    LoggerService.log("error", error.message, {
      error: error,
      data: { group: "APP_STARTUP" },
    });

    process.exit(1);
  });
