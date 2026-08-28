import { Service } from "typedi";
import { IsNull } from "typeorm";
import jwt, { Secret } from "jsonwebtoken";

import { postgresDataSource } from "../loaders/typeOrm.loader";

import { User } from "../models/user.model";
import { UserSession } from "../models/userSession.model";

import { eUserSessionLogoutTypes } from "../constants/user.constant";

import env from "../env";

@Service()
export default class UserRepository {
  user = postgresDataSource.getRepository(User);
  userSession = postgresDataSource.getRepository(UserSession);

  // User
  async createUser(payload: { full_name: string; email: string; password: string }) {
    return await this.user.save(payload);
  }

  async getUserByEmail(email: string) {
    return await this.user.findOne({
      where: {
        email,
      },
    });
  }

  async getAuthUser(id: string) {
    return await this.user.findOne({
      where: { id },
    });
  }

  async getUserDetails(id: string) {
    const userDetails = await this.user.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
      },
    });

    if (!userDetails) return;

    return userDetails;
  }

  // Session
  async createSession(userId: string) {
    const { jwtAccessTokenKey, jwtAccessTokenExpiry } = env.app.config;

    const iat = Date.now();
    const exp = iat + jwtAccessTokenExpiry;

    const session = await this.userSession.save({
      user_id: userId,
      date_logged_in: new Date(iat),
      token_expires_by: new Date(exp),
    });

    return jwt.sign(
      {
        userId: userId,
        sessionId: session.id,
        iat,
        exp,
      },
      jwtAccessTokenKey as Secret,
      {
        algorithm: "HS256",
      },
    );
  }

  async getAuthSession(userId: string, sessionId: string) {
    return await this.userSession.findOne({
      where: {
        id: sessionId,
        user_id: userId,
        date_logged_out: IsNull(),
        logout_type: IsNull(),
      },
    });
  }

  async logoutSession(sessionId: string, logoutType: eUserSessionLogoutTypes) {
    return this.userSession.update(sessionId, {
      logout_type: logoutType,
      date_logged_out: new Date(),
    });
  }
}
