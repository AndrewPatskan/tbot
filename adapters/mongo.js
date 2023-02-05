const { MongoClient } = require('mongodb');

const { config } = require('../config');

class Mongo {
  constructor() {
    this.mongoClient = new MongoClient(config.MONGO_URI);

    this.Users = this.mongoClient.db('tbot').collection('Users');

    this.Queues = this.mongoClient.db('tbot').collection('Queues')

    console.log(`Mongo connected at ${config.MONGO_URI}`);
  }

  async saveUser(user) {
    return this.Users.insertOne(user);
  }

  async getUser(chatId) {
    return this.Users.findOne({ chatId });
  }

  async updateUser(chatId, street) {
    return this.Users.updateOne({ chatId }, { $set: { street } });
  }

  async deleteUser(chatId) {
    return this.Users.deleteOne({ chatId });
  }

  async getAllUsers(callback) {
    const users = await this.Users.find({});

    for await (const user of users) {
      await callback(user);
    }
  }

  async getQueueByStreet(street) {
    return this.Queues.find({ streets: { $regex: new RegExp(street, 'i') } }).toArray();
  }

  async getImageName() {
    return this.Queues.findOne({ idName: config.SCHEDULE_IMAGE_NAME });
  }

  async saveQueue(match, data) {
    return this.Queues.updateOne(match, { $set: data }, { upsert: true })
  }
}

module.exports = { db: new Mongo() };
