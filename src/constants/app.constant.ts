import REDIS from "../redis";

// [Constants]
export const QUEUE_KEY = REDIS.getQueueKey("jobs");

// [Enums]
export enum eAppSettings {
  NOREPLY_EMAIL = "email_noreply",
  SUPPORT_EMAIL = "email_support",
  SUPPORT_TELEPHONE = "telephone_support",
  ADDRESS = "address",
}

export enum eSocialLinksSettings {
  LINKEDIN = "social_link_linkedin",
  X = "social_link_x",
  INSTAGRAM = "social_link_instagram",
  FACEBOOK = "social_link_facebook",
}
