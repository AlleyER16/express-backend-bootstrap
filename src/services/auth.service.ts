import bcrypt from "bcrypt";
import { Service } from "typedi";

import { redisClient } from "../loaders/redis.loader";

import EmailService from "./email.service";
import AppUtilService from "./appUtil.service";
import { ServiceResponse } from "./response.service";

import UserRepository from "../repositories/user.repository";

import { LoginDTO, SignupDTO, SignupRequestOTPDTO } from "../dtos/auth.dto";

import { eUserSessionLogoutTypes } from "../constants/user.constant";

import env from "../env";
import REDIS from "../redis";

@Service()
export default class AuthService {
  constructor(
    private userRepository: UserRepository,

    private emailService: EmailService,
    private appUtilService: AppUtilService,
  ) {}

  // Login
  public async login({ email, password }: LoginDTO) {
    // Get user exists by email
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) ServiceResponse.error("Incorrect email or password");

    // Check if password is valid
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) ServiceResponse.error("Incorrect email or password");

    // User details without sensitive data and accessToken
    const [userDetails, accessToken] = await Promise.all([this.userRepository.getUserDetails(user.id), this.userRepository.createSession(user.id)]);

    return ServiceResponse.success("Login successful", {
      accessToken,
      userDetails,
    });
  }

  // Sign Up
  async signupRequestOTP({ email }: SignupRequestOTPDTO) {
    // Email check
    const emailExists = await this.userRepository.getUserByEmail(email);
    if (emailExists) ServiceResponse.error("Email address has been used");

    // Generate OTP
    const otp = this.appUtilService.generateOTP();

    // Store OTP Temporarily
    await redisClient.set(REDIS.getKey(`users:signup_otp:${email}`), otp, {
      EX: env.app.config.cacheExpiration,
    });

    // Send OTP Email
    await this.emailService.sendEmail(email, {
      name: "signUpEmailVerification",
      data: {
        otp,
        expiresIn: env.app.config.cacheExpiration,
      },
    });

    // Return Response
    return ServiceResponse.success(`A 6-digit OTP has been sent to ${email}`, {});
  }

  async signup(payload: SignupDTO) {
    // Email check
    const emailExists = await this.userRepository.getUserByEmail(payload.email);
    if (emailExists) ServiceResponse.error("User with this email already exists");

    // Check OTP against signup OTP
    const storedOTP = await redisClient.get(REDIS.getKey(`users:signup_otp:${payload.email}`));
    if (!storedOTP || storedOTP !== payload.otp) ServiceResponse.error("Invalid OTP entered");

    // Create user
    const user = await this.userRepository.createUser({
      ...payload,
      password: await bcrypt.hash(payload.password, 10),
    });

    // Send onboarded email
    await this.emailService.sendEmail(user.email, {
      name: "userOnboarded",
    });

    // Return user details and token
    const [userDetails, accessToken] = await Promise.all([this.userRepository.getUserDetails(user.id), this.userRepository.createSession(user.id)]);

    return ServiceResponse.success("Signup successful", {
      userDetails,
      accessToken,
    });
  }

  // Logout
  public async logout(sessionId: string) {
    await this.userRepository.logoutSession(sessionId, eUserSessionLogoutTypes.LOGOUT);

    return ServiceResponse.success("Logout successful", {});
  }
}
