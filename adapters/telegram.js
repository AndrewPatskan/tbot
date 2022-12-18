const { Client } = require('undici');

const { config: { TELEGRAM_URL, TELEGRAM_TOKEN } } = require('../config');

class Telegram {
  constructor() {
    this.telegramClient = new Client(TELEGRAM_URL);
  }

  async sendMessage(query) {
    const response = await this.telegramClient.request({
      method: 'GET',
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      query,
    });

    const data = await response.body.json();

    return {
      data,
      status: response.statusCode,
      message: response.message || '',
    };
  }
}

module.exports = { telegram: new Telegram() };
