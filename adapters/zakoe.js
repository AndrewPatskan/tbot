const { Client } = require('undici');

const {
  config: { ZAKOE_URL },
} = require('../config');

class Telegram {
  constructor() {
    this.zakoeClient = new Client(ZAKOE_URL);
  }

  async getMainPage(query) {
    const response = await this.zakoeClient.request({
      method: 'GET',
      path: '/customers/break-in-electricity-supply/schedule/',
      query,
    });

    return response?.body?.json();
  }

  async getCPDF(cNumber) {
    const response = await this.zakoeClient.request({
      method: 'GET',
      path: `/customers/break-in-electricity-supply/schedule/cherga${cNumber}.pdf`,
      query,
    });

    return response?.body?.json();
  }
}

module.exports = { telegram: new Telegram() };
