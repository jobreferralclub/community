// redisClient.js
import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1", // your redis host
  port: 6379,        // default port
  // password: "yourpassword", // if using auth
});

export default redis;
