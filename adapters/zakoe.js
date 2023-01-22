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
    });

    return response?.body?.text();
  }

  async getScheduleImage(path) {
    const response = await this.zakoeClient.request({
      method: 'GET',
      path,
    });

    return response?.body;
  }
}

module.exports = { zakoe: new ZakOE() };
