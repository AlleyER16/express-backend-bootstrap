import { Service } from "typedi";

import { User } from "../models/user.model";

import UserRepository from "../repositories/user.repository";

import { ServiceResponse } from "./response.service";

@Service()
export default class AccountService {
  constructor(private userRepository: UserRepository) {}

  // Get Profile
  public async getProfile(user: User) {
    return ServiceResponse.success("Profile fetched successfully", await this.userRepository.getUserDetails(user.id));
  }
}
