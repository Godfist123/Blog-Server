const redis = require("redis");
const { REDIS_CONFIG } = require("../config/db");

// Create and connect the Redis client
const redisClient = redis.createClient({
  socket: {
    host: REDIS_CONFIG.host,
    port: REDIS_CONFIG.port,
  },
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error", error);
});

redisClient.connect();

const set = (key, val) => {
  if (typeof val === "object") {
    // Ensure val is properly serialized as a JSON string
    val = JSON.stringify(val);
  }
  return new Promise((resolve, reject) => {
    // Use a callback to handle the response from Redis
    redisClient.set(key, val, (err, reply) => {
      if (err) {
        console.error(`Failed to set key ${key} in Redis:`, err);
        reject(err); // Reject the promise if an error occurs
      } else {
        console.log(`Key ${key} set in Redis.`);
        resolve(reply); // Resolve the promise with Redis' response
      }
    });
  });
};

const get = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        console.error(`Error retrieving key ${key} from Redis:`, err);
        reject(err);
        return;
      }
      if (val === null) {
        console.log(`Key ${key} not found in Redis.`);
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(val));
      } catch (error) {
        console.error(`Error parsing value for key ${key}:`, error);
        resolve(val); // Resolve with raw value if JSON parsing fails
      }
    });
  });
};

module.exports = {
  set,
  get,
};
