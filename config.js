require("dotenv").config();
const { deepFreeze } = require("./utils/freeze");

module.exports.config = deepFreeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "127.0.0.1",
  PORT: (process.env.PORT && +process.env.PORT) || 2512,
  LOCAL_URL: process.env.LOCAL_URL || "http://127.0.0.1:2512",
  SCHEDULE_IMAGE_NAME: process.env.SCHEDULE_IMAGE_NAME || "schedule.jpg",
  TELEGRAM_URL: process.env.TELEGRAM_URL || "https://api.telegram.org",
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tbot",
  ZAKOE_URL: process.env.ZAKOE_URL || "https://zakarpat.energy",
  // @ts-ignore
  USE_BROWSER_EMULATION:
    !!+process.env.USE_BROWSER_EMULATION ||
    process.env.NODE_ENV === "development",
  PREFER_BROWSER_EMULATION:
    !!+process.env.USE_BROWSER_EMULATION &&
    !!+process.env.PREFER_BROWSER_EMULATION,
});
