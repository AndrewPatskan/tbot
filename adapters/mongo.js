const { MongoClient } = require('mongodb');

const { config: { MONGO_URI } } = require('../config');

class Mongo {
  constructor() {
    this.mongoClient = new MongoClient(MONGO_URI);

    this.Users = this.mongoClient.db('tbot').collection('Users')

    console.log(`Mongo connected at ${MONGO_URI}`);
  }

  async saveUser(user) {
    return this.Users.insertOne(user);
  }

  async getUser(filter) {
    return this.Users.findOne(filter);
  }

  async deleteUser(filter) {
    return this.Users.deleteOne(filter);
  }

  async getAllUsers() {
    return this.Users.find({});
  }
}

module.exports = { db: new Mongo() };
