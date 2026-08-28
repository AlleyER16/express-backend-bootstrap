import { MicroframeworkSettings } from "microframework-w3tec";

import LoggerService from "../services/logger.service";

import dataSource from "../datasource";

export const postgresDataSource = dataSource;

export default async function (settings: MicroframeworkSettings | undefined) {
  if (!settings) throw new Error("Microframework settings are not initialized correctly");

  await postgresDataSource.initialize();

  LoggerService.log("info", "Postgres DB connection established");

  settings.onShutdown(async () => {
    await postgresDataSource.destroy();
    LoggerService.log("info", "Postgres DB connection closed");
  });
}
