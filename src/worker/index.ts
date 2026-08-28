import { bootstrapMicroframework } from "microframework-w3tec";

import { typeOrmLoader } from "../loaders";

import LoggerService from "../services/logger.service";

import { connection } from "./config";

import worker from "./main";

bootstrapMicroframework({
  loaders: [typeOrmLoader], // Database will be needed in some background operations
})
  .then((framework) => {
    ["SIGTERM", "SIGINT", "SIGUSR2"].map((signalType) => {
      process.once(signalType, async () => {
        try {
          await worker.close(); // Close worker
          await connection.quit(); // Close connection

          await framework.shutdown();
        } catch (error) {
          LoggerService.log("error", "Graceful shutdown failed", {
            error: error as Error,
            data: { group: "WORKER_SHUTDOWN" },
          });

          process.exitCode = 1;
        }
      });
    });
  })
  .catch((error) => {
    LoggerService.log("error", error.message, {
      error: error,
      data: { group: "WORKER_STARTUP" },
    });

    process.exit(1);
  });
