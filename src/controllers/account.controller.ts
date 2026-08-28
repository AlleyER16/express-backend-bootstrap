import Container from "typedi";
import { Get, HttpCode, JsonController, Req, UseBefore } from "routing-controllers";

import AccountService from "../services/account.service";

import userAuth from "../middlewares/userAuth.middleware";

import { UserRequest } from "../interfaces/request.interface";

@JsonController("/account")
export default class AccountController {
  accountService = Container.get(AccountService);

  /**
   * @openapi
   * '/account/me':
   *  get:
   *     tags:
   *     - Account
   *     summary: Get user profile
   *     security:
   *     - bearerAuth: []
   *     responses:
   *      200:
   *        description: Profile fetched successfully
   */
  @Get("/me")
  @HttpCode(200)
  @UseBefore(userAuth())
  public async fetchUserProfile(@Req() req: UserRequest) {
    return await this.accountService.getProfile(req.user);
  }
}
