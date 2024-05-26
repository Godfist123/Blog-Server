const redis = require("redis");
const { REDIS_CONFIG } = require("../config/db.js");

const redisClient = redis.createClient({
  url: `redis://${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`,
  legacyMode: true,
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
