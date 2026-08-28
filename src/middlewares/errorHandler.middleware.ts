import { AxiosError } from "axios";
import { MulterError } from "multer";
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from "routing-controllers";

import LoggerService from "../services/logger.service";
import { ErrorResponse } from "../services/response.service";

import AppError from "../utils/appError.util";

// Handle global error handling here
@Middleware({
  type: "after",
})
export default class HttpErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: () => any) {
    // DTO validation error
    if (error.name === "BadRequestError" && Array.isArray(error.errors))
      return response.status(400).json({
        status: "error",
        message: error.message,
        error: error.errors,
      });

    // App error
    if (error instanceof AppError)
      return response.status(error.httpCode).json({
        status: "error",
        message: error.message,
        error: error.errors,
      });

    // Multer Error
    if (error instanceof MulterError)
      return response.status(400).json({
        status: "error",
        message: error.message,
      });

    // HTTP Error
    if (error instanceof HttpError)
      return response.status(error.httpCode).json({
        status: "error",
        message: error.message,
        error: (error as ErrorResponse)?.errors,
      });

    // Axios Error
    if (error instanceof AxiosError)
      LoggerService.log("error", error.message, {
        error: error as Error,
        data: {
          group: "EXTERNAL_API_REQUEST",
          apiPath: error.response?.config.url,
          apiHeaders: error.response?.config.headers,
          requestBody: error.response?.config.data,
          response: error.response?.data,
        },
      });
    else
      // Outlier errors / Exceptions
      LoggerService.log("error", error.message, {
        error: error as Error,
        data: {
          group: "API_REQUEST",
          apiPath: request.url,
          requestBody: request.body,
        },
      });

    response.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
}
