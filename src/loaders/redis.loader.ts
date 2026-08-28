import { createClient } from "redis";
import { MicroframeworkSettings } from "microframework-w3tec";

import LoggerService from "../services/logger.service";

import AppSettings from "../settings";

import { queueCleanup } from "../queue";

import env from "../env";

export const redisClient: ReturnType<typeof createClient> = createClient({
  url: env.redis.URL,
});

redisClient.on("error", (err) => {
  LoggerService.log("error", err.message, {
    error: err as Error,
    data: { group: "APP_RUNNING" },
  });

  process.exit(1);
});

export const appSettings = new AppSettings();

export default async function (settings: MicroframeworkSettings | undefined) {
  if (!settings) throw new Error("Microframework settings are not initialized correctly");

  await redisClient.connect();
  LoggerService.log("info", "Redis DB connection established");

  await appSettings.loadSettings(redisClient);
  LoggerService.log("info", "Settings loaded successfully");

  settings.onShutdown(async () => {
    redisClient.destroy();
    LoggerService.log("info", "Redis DB connection closed");

    await queueCleanup();
    LoggerService.log("info", "Queue closed");
  });
}
