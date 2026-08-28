import Container from "typedi";
import jwt, { Secret } from "jsonwebtoken";
import { HttpError } from "routing-controllers";
import { Response, NextFunction } from "express";

import LoggerService from "../services/logger.service";
import { ErrorResponse, ServiceResponse } from "../services/response.service";

import UserRepository from "../repositories/user.repository";

import { UserRequest } from "../interfaces/request.interface";

import env from "../env";

const userRepo = Container.get(UserRepository);

const doAuth = async (accessToken: string, withError: boolean = false) => {
  // Check access token
  if (!accessToken) ServiceResponse.error("Unauthorized", 401, withError ? "No access token" : "");

  // Decode access token
  const { userId, sessionId } = jwt.verify(accessToken, env.app.config.jwtAccessTokenKey as Secret) as { userId: string; sessionId: string };
  if (!userId || !sessionId) ServiceResponse.error("Unauthorized", 401, withError ? "No user session info" : "");

  // Check user
  const [user, session] = await Promise.all([userRepo.getAuthUser(userId), userRepo.getAuthSession(userId, sessionId)]);
  if (!user || !session) ServiceResponse.error("Unauthorized", 401, withError ? "Invalid user session info" : "");

  // Check expiry
  if (new Date().getTime() > new Date(session.token_expires_by).getTime())
    ServiceResponse.error("Unauthorized", 401, withError ? "Session expired" : ""); // Might want to update session with logout_type: EUserSessionLogoutTypes.EXPIRED but not really required

  return { user, session };
};

export default (options?: { optional?: boolean }): any =>
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { user, session } = await doAuth((req.headers.authorization as string)?.split(" ")[1] || "");

      req.user = user;
      req.session = session;

      next();
    } catch (error) {
      if (!(error instanceof HttpError))
        LoggerService.log("error", (error as Error).message, {
          error: error as Error,
        });

      if (options?.optional) return next();

      ServiceResponse.error("Unauthorized", 401, (error as ErrorResponse).errors || "");
    }
  };
