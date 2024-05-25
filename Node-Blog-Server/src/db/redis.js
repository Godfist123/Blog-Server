const redis = require("redis");
const { REDIS_CONFIG } = require("../config/db");

const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);

(async () => {
  await redisClient.connect().then(() => {
    console.log("connected");
  });
})();

const set = async (key, val) => {
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }
  await redisClient.set(key, val);
};

const get = async (key) => {
  try {
    let val = await redisClient.get(key);
    if (val == null) {
      return val;
    }
    try {
      val = JSON.parse(val);
    } catch (error) {}
    return val;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  set,
  get,
};
