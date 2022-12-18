require('dotenv').config();

module.exports = { config: Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 2512,
  TELEGRAM_URL: process.env.TELEGRAM_URL || 'https://api.telegram.org',
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '5822072541:AAGwpNbzub3sI4SSLKvZOrPl3Ya-dg5TxMk',
}), };