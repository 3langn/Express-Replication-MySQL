import dotenv from 'dotenv';
dotenv.config();
const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3100,
  jwt: {
    secret: process.env.JWT_SECRET || 'thisisasamplesecret',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30,
  },
  redis: {
    expires: 3600,
    url: process.env.REDIS_URL || 'redis',
    port: process.env.REDIS_PORT || 6379,
  },
};
export default config;
