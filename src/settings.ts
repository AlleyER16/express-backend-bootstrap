import { createClient } from "redis";

import { postgresDataSource } from "./loaders/typeOrm.loader";

import { Setting } from "./models/settings.model";

import REDIS from "./redis";

export default class AppSettings {
  redisClient: ReturnType<typeof createClient> | null = null;

  // Initialize and load base settings from DB to cache
  async loadSettings(redisClient: ReturnType<typeof createClient>) {
    this.redisClient = redisClient;

    const settingsModel = postgresDataSource.getRepository(Setting);

    const settings = await settingsModel.find({
      select: {
        code: true,
        value: true,
      },
    });

    const data: { [key: string]: string } = {};

    settings.map((setting) => {
      data[REDIS.getKey(`appSettings:${setting.code}`)] = setting.value;
    });

    await this.redisClient.mSet(data);
  }

  // Get value for a couple of keys and put them in an object
  async get(keys: string[]): Promise<Record<string, string>> {
    const data: Record<string, string> = {};

    const values = (await this.redisClient!.mGet(keys.map((key) => REDIS.getKey(`appSettings:${key}`)))) as string[];

    values.forEach((value, i) => {
      data[keys[i]] = value!;
    });

    return data;
  }

  // Update settings in group
  async update(payload: Record<string, any>): Promise<void> {
    const data: { [key: string]: string } = {};

    Object.entries(payload).map(([key, value]) => {
      data[REDIS.getKey(`appSettings:${key}`)] = value.toString();
    });

    await this.redisClient!.mSet(data);
  }
}
