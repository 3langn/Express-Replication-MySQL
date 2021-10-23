import redis from 'redis';
import config from './config';
const redisClient = redis.createClient({
  host: config.redis.url,
  port: typeof config.redis.port == 'string' ? parseInt(config.redis.port) : config.redis.port,
});
export default redisClient;
