const { Client } = require('undici');

const {
  config: { ZAKOE_URL },
} = require('../config');

class ZakOE {
  constructor() {
    this.zakoeClient = new Client(ZAKOE_URL);
  }

  async getMainPage() {
    const response = await this.zakoeClient.request({
      method: 'GET',
      path: '/customers/break-in-electricity-supply/schedule/',
      headers: {
        "user-agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      },
    });

    return response?.body?.text();
  }

  async getScheduleImage(path) {
    const response = await this.zakoeClient.request({
      method: 'GET',
      path,
      headers: {
        "user-agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      },
    });

    return response?.body;
  }
}

module.exports = { zakoe: new ZakOE() };
