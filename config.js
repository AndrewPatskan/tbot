require('dotenv').config();

module.exports.config = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '127.0.0.1',
  PORT: (process.env.PORT && +process.env.PORT) || 2512,
  LOCAL_URL: process.env.LOCAL_URL || 'http://127.0.0.1:2512',
  SCHEDULE_IMAGE_NAME: process.env.SCHEDULE_IMAGE_NAME || 'shedule.jpg',
  TELEGRAM_URL: process.env.TELEGRAM_URL || 'https://api.telegram.org',
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tbot',
  ZAKOE_URL: process.env.ZAKOE_URL || 'https://zakarpat.energy',
});