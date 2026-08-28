import cors from "cors";
import morgan from "morgan";
import express from "express";
import { createServer } from "http";
import { useExpressServer } from "routing-controllers";
import { MicroframeworkSettings } from "microframework-w3tec";

import HttpErrorHandlerMiddleware from "../middlewares/errorHandler.middleware";

import LoggerService from "../services/logger.service";

import controllers from "../controllers";

import swaggerDocs from "../utils/apiDoc.util";

import env from "../env";

export default function (settings: MicroframeworkSettings | undefined) {
  if (!settings) {
    throw new Error("Microframework settings are not initialized correctly");
  }

  const expressInstance = express();

  // Middlewares
  expressInstance.use(cors());
  expressInstance.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  useExpressServer(expressInstance, {
    classTransformer: true,
    defaultErrorHandler: false,
    controllers,
    middlewares: [HttpErrorHandlerMiddleware],
  });

  const httpServer = createServer(expressInstance);

  // This httpServer can be extended to work with socket.io

  httpServer.listen(env.port, function () {
    LoggerService.log("info", `Application running successfully on ${env.port}`);

    swaggerDocs(expressInstance);

    settings.onShutdown(() => {
      httpServer.close();
      LoggerService.log("info", `Application server closed`);
    });
  });
}
