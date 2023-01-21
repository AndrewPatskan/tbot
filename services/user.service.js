const { telegram } = require('../adapters/telegram');

const { db } = require('../adapters/mongo');

class UserService {
  async initBot(body) {
    const {} = body;

    return telegram.sendMessage({ chat_id: body.message.chat.id, text: 'Введіть назву вулиці. Наприклад: Швабська' });
  }

  async startBot(body) {
    return telegram.sendMessage({ chat_id: body.message.chat.id, text: 'sps' });
  }

  async stopBot(body) {
    // await db.deleteUser();

    return telegram.sendMessage({ chat_id: body.message.chat.id, text: 'Дані вилучено' });
  }

  async cronJob() {

  }
}

module.exports = { userService: new UserService() };
