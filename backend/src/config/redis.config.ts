import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "./env.config";

let redisClient: RedisClientType | undefined;

async function connectRedis() {
  try {
    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        reconnectStrategy(retries) {
          if (retries > 5) {
            console.error("Max Redis reconnect attempts reached!");
            return false;
          }
          return Math.min(retries * 100, 2000);
        },
      },
    });

    redisClient.on("connect", () => console.log("🍁 Redis Connected !!"));
    redisClient.on("error", (err) => console.error("Redis Client Error", err));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw error;
  }
}

export { connectRedis, redisClient };