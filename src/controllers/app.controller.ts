import Container from "typedi";
import { Request } from "express";
import { Get, JsonController, Post, Req, UseBefore } from "routing-controllers";

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

  /**
   * @openapi
   * /upload:
   *   post:
   *     summary: Upload a file
   *     tags:
   *       - App
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: File to upload
   *     responses:
   *       200:
   *         description: File uploaded successfully
   *       400:
   *         description: Invalid file format
   */
  @Post("/upload")
  @UseBefore(rateLimiter(1, 1))
  @UseBefore(FileUploadService.fileUpload())
  async testUpload(@Req() req: Request) {
    return await this.appService.testUpload(req.file as Express.MulterS3.File | undefined);
  }
}
