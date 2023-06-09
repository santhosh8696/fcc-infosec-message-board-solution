const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const connect = async () => {
  const connection = await mongoClient.connect(process.env.DB);
  global.dbConnection = connection;
};

module.exports = connect;