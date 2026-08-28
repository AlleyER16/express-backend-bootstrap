import env from "./env";

export default class REDIS {
  static getKey(key: string) {
    return `${env.redis.APP_KEY_PREFIX}:${key}`;
  }

  static getQueueKey(key: string) {
    return `${env.redis.APP_KEY_PREFIX}-${key}`;
  }
}
