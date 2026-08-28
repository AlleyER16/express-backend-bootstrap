import Container from "typedi";
import { Get, JsonController, Post, UploadedFile, UseBefore } from "routing-controllers";

import rateLimiter from "../middlewares/rateLimit.middleware";

import AppService from "../services/app.service";
import FileUploadService from "../services/fileUpload.service";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

@JsonController("")
export default class AppController {
  appService = Container.get(AppService);

  /**
   * @openapi
   * '/':
   *  get:
   *     summary: Root / Health Check
   *     tags:
   *     - App
   *     responses:
   *      200:
   *        description: Fetched Successfully
   */
  @Get("/")
  rootPath() {
    return this.appService.rootPath();
  }

  @Post("/upload")
  @UseBefore(rateLimiter(1, 1))
  @UseBefore(FileUploadService.fileUpload())
  async testUpload(@UploadedFile("file") file: Express.MulterS3.File) {
    return await this.appService.testUpload(file);
  }
}
