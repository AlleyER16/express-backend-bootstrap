import { Request } from "express";

import { User } from "../models/user.model";
import { UserSession } from "../models/userSession.model";

export interface UserRequest extends Request {
  user: User;
  session: UserSession;
}

export interface RawBodyRequest extends Request {
  rawBody: string;
}
