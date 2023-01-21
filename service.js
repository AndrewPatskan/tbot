const fs = require('fs');
const { join } = require('path');
const { parse: htmlParse }  = require('node-html-parser');

const { telegram } = require('./adapters/telegram');

const { db } = require('./adapters/mongo');

const { zakoe } = require('./adapters/zakoe');

const { TEXTS } = require('./constants/texts.ua');

const { config } = require('./config');

class Service {
  async initBot(body) {
    const chatId = body.message.chat.id;

    const user = await db.getUser(chatId);

    if (!user) {
      return telegram.sendMessage({
        chat_id: body.message.chat.id,
        text: TEXTS.ASK_STREET,
      });
    }

    return telegram.sendMessage({
      chat_id: body.message.chat.id,
      text: TEXTS.UPDATE_STREET,
    });
  }

  async startBot(body) {
    const { text: street, chat: { id: chatId, first_name, last_name, username } } = body;

    const [data, user] = await Promise.all([
      Service.findQueue(street),
      db.getUser(chatId),
    ]);

    if (!data) {
      return telegram.sendMessage({
        chat_id: chatId,
        text: TEXTS.NOT_FOUND,
      });
    }

    if (!user) {
      await db.saveUser({
        chatId,
        first_name,
        last_name,
        username,
        street,
      });
    } else {
      await db.updateUser(chatId, street);
    }

    await telegram.sendMessage({
      chat_id: chatId,
      text: data.queue,
    });

    return telegram.sendPhoto({
      chat_id: chatId,
      photo: data.imageUrl,
    });
  }

  async stopBot(body) {
    const chatId = body.message.chat.id

    await db.deleteUser(chatId);

    return telegram.sendMessage({
      chat_id: chatId,
      text: TEXTS.DATA_REMOVED,
    });
  }

  async updateScheduleCJ() {
    // const page = await zakoe.getMainPage();

    // const parsedPage = htmlParse(page);

    const sheduleImage = await zakoe.getSheduleImage('/upload/current-timetable/ff8/jhkx87wd33cjf915cw790ywh2a6ayqik/gr_210123.PNG');

    const imageFolder = join(__dirname, `/images`);
  
    if (!fs.existsSync(imageFolder)) {
      await fs.promises.mkdir(imageFolder);
    }

    sheduleImage.pipe(fs.createWriteStream(`${imageFolder}/${config.SHEDULE_IMAGE_NAME}`));
  }

  async sendNewScheduleCJ() {
    await db.getAllUsers(async (user) => {
      const data = await Service.findQueue(user.street);

      await telegram.sendMessage({
        chat_id: chatId,
        text: data.queue,
      });
  
      await telegram.sendPhoto({
        chat_id: chatId,
        photo: data.imageUrl,
      });
    });
  }

  static async findQueue(street) {
    // const queue = await db.getQueueByStreet(street);

    // if (!queue || !queue.length) {
    //   return null;
    // }

    return {
      queue: 1,
      imageUrl: config.SHEDULE_IMAGE_URL,
    }
  }
}

module.exports = { service: new Service() };
