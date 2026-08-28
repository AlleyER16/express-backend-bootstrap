import { Service } from "typedi";

import env from "../env";

@Service()
export default class AppUtilService {
  // Generate OTP
  generateOTP() {
    if (env.nodeEnv !== "production") return "123456";

    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }
}
