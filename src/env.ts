import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 9000,
  nodeEnv: process.env.NODE_ENV || "development",

  isEmailTest: process.env.EMAIL_TEST === "true",

  app: {
    name: process.env.APP_NAME!,

    baseUrl: process.env.BASE_URL!,

    emailSending: {
      logo: process.env.EMAIL_SENDING_LOGO!,
      socialIcons: {
        x: process.env.EMAIL_SENDING_SOCIAL_ICONS_X!,
        linkedin: process.env.EMAIL_SENDING_SOCIAL_ICONS_LINKEDIN!,
        instagram: process.env.EMAIL_SENDING_SOCIAL_ICONS_INSTAGRAM!,
        facebook: process.env.EMAIL_SENDING_SOCIAL_ICONS_FACEBOOK!,
      },
    },

    config: {
      cacheExpiration: parseInt(process.env.CACHE_EXPIRATION!),

      jwtAccessTokenKey: process.env.JWT_ACCESS_TOKEN_KEY!,
      jwtAccessTokenExpiry: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES!),
    },
  },

  db: {
    url: process.env.DB_URL!,
    type: process.env.DB_TYPE! as any,
    ssl: process.env.DB_SSL! === "true",
    certificate: process.env.DB_CERTIFICATE ? path.join(__dirname, `../keys/${process.env.DB_CERTIFICATE}`) : undefined,
  },

  redis: {
    APP_KEY_PREFIX: process.env.REDIS_APP_KEY_PREFIX!,
    URL: process.env.REDIS_URL!,
  },

  mailtrap: {
    host: process.env.MAILTRAP_HOST!,
    port: Number(process.env.MAILTRAP_PORT!),
    user: process.env.MAILTRAP_USER!,
    password: process.env.MAILTRAP_PASS!,
  },

  mailtrapSandbox: {
    host: process.env.MAILTRAP_SANDBOX_HOST!,
    port: Number(process.env.MAILTRAP_SANDBOX_PORT!),
    user: process.env.MAILTRAP_SANDBOX_USER!,
    password: process.env.MAILTRAP_SANDBOX_PASS!,
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    defaultRegion: process.env.AWS_DEFAULT_REGION!,
    bucket: process.env.AWS_BUCKET!,
    usePathStyleEndpoint: process.env.AWS_USE_PATH_STYLE_ENDPOINT! === "true",
    filesBaseUrl: process.env.AWS_FILES_BASE_URL!,
  },
};
