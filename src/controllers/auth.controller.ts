import Container from "typedi";
import { Body, Delete, HttpCode, JsonController, Post, Req, UseBefore } from "routing-controllers";

import AuthService from "../services/auth.service";

import userAuth from "../middlewares/userAuth.middleware";

import { UserRequest } from "../interfaces/request.interface";

import { LoginDTO, SignupDTO, SignupRequestOTPDTO } from "../dtos/auth.dto";

@JsonController("/auth")
export default class AuthController {
  authService = Container.get(AuthService);

  /**
   * @openapi
   * '/auth/sign-up/request-otp':
   *   post:
   *     summary: Sign Up Request Email OTP
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: OTP Sent Successfully
   *       400:
   *         description: Email already taken
   */
  @Post("/sign-up/request-otp")
  @HttpCode(200)
  async signupRequestOTP(
    @Body({
      required: true,
    })
    body: SignupRequestOTPDTO,
  ) {
    return await this.authService.signupRequestOTP(body);
  }

  /**
   * @openapi
   * '/auth/sign-up':
   *   post:
   *     summary: Sign Up Request Email OTP
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - full_name
   *               - email
   *               - password
   *               - otp
   *             properties:
   *               full_name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *               otp:
   *                 type: string
   *     responses:
   *       200:
   *         description: OTP Sent Successfully
   *       400:
   *         description: Email already taken
   */
  @Post("/sign-up")
  @HttpCode(201)
  public async signup(
    @Body({
      required: true,
    })
    body: SignupDTO,
  ) {
    return await this.authService.signup(body);
  }

  /**
   * @openapi
   * '/auth/login':
   *   post:
   *     summary: Login
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       400:
   *         description: Incorrect email or password
   */
  @Post("/login")
  @HttpCode(200)
  public async login(
    @Body({
      required: true,
    })
    body: LoginDTO,
  ) {
    return await this.authService.login(body);
  }

  /**
   * @openapi
   * '/auth/logout':
   *  delete:
   *     tags:
   *     - Auth
   *     summary: Logout
   *     security:
   *     - bearerAuth: []
   *     responses:
   *      200:
   *        description: Logout user successfully
   */
  @Delete("/logout")
  @HttpCode(200)
  @UseBefore(userAuth())
  public async logout(@Req() req: UserRequest) {
    return await this.authService.logout(req.session.id);
  }
}
