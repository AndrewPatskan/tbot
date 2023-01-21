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

    return response?.body?.json();
  }
}

module.exports = { telegram: new Telegram() };
