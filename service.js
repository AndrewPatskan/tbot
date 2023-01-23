const fs = require("fs");
const { parse: htmlParse } = require("node-html-parser");
const pdf = require("pdf-parse");
const { resolve } = require("path");
const sharp = require("sharp");

const { telegram } = require("./adapters/telegram");

const { db } = require("./adapters/mongo");

const { zakoe } = require("./adapters/zakoe");

const { TEXTS } = require("./constants/texts.ua");

const { config } = require("./config");

const wait = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

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
    const {
      message: { chat, text: street },
    } = body;

    const { id: chatId, first_name, last_name, username } = chat;

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

    console.log(data.imageUrl);

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
    const chatId = body?.message?.chat.id || body?.my_chat_member?.chat.id;

    await db.deleteUser(chatId);

    return telegram.sendMessage({
      chat_id: chatId,
      text: TEXTS.DATA_REMOVED,
    });
  }

  async updateScheduleCJ() {
    // parse page
    const page = await zakoe.getMainPage();

    const parsedPage = htmlParse(page);

    console.log(page);
    console.log(parsedPage);

    const pdfElems = parsedPage
      .getElementsByTagName("a")
      .filter(
        (elem) =>
          elem
            .getAttribute("href")
            .includes("customers/break-in-electricity-supply/schedule") &&
          elem.getAttribute("class") === "title"
      );

    const scheduleImageUrl = parsedPage
      .getElementsByTagName("img")
      .find((elem) => elem.getAttribute("src").includes("upload"))
      .getAttribute("src");

    // download image and pdfs
    const imageFolder = "./public";

    if (!fs.existsSync(imageFolder)) {
      await fs.promises.mkdir(imageFolder);
    }

    const scheduleImageStream = await zakoe.getScheduleImage(scheduleImageUrl);

    const tempPath = `${imageFolder}/rt${config.SCHEDULE_IMAGE_NAME}`;

    await Service.writeStream(scheduleImageStream, tempPath);

    await sharp(tempPath)
      .resize(1260, 280, {
        kernel: sharp.kernel.nearest,
        fit: "cover",
      })
      .toFile(`${imageFolder}/${config.SCHEDULE_IMAGE_NAME}`);

    await fs.promises.unlink(tempPath);

    let queue = 1;

    for (const pdfElem of pdfElems) {
      const pdfStream = await zakoe.getScheduleImage(
        pdfElem.getAttribute("href")
      );

      await Service.writeStream(pdfStream, `${imageFolder}/${queue}.pdf`);

      await wait(2000);

      const file = await fs.promises.readFile(
        resolve(__dirname, `./public/${queue}.pdf`)
      );

      const pdfObj = await pdf(file);

      await db.saveQueue({ queue }, { queue, streets: pdfObj.text });

      queue += 1;
    }
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
    // const docs = await db.getQueueByStreet(street);

    // if (!docs || !docs.length) {
    //   return null;
    // }

    return {
      // queue: `Черги: ${docs.map((el) => el.queue).join(', ')}`,
      queue: 4,
      imageUrl: `${config.LOCAL_URL}/${config.SCHEDULE_IMAGE_NAME}`,
    };
  }

  static async writeStream(stream, path) {
    const writeStrm = stream.pipe(fs.createWriteStream(path));

    return new Promise((resolve, reject) => {
      writeStrm.on("finish", () => {
        resolve("complete");
      });

      writeStrm.on("error", reject);
    });
  }
}

module.exports = { service: new Service() };
