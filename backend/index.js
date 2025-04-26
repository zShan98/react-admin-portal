const app = require('./app');
const db = require('./db');
const dotenv = require('dotenv');
const serverless = require('serverless-http'); // Added!

dotenv.config();

// Connect to DB
let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    await db.connect();
    isConnected = true;
    console.log('MongoDB connected');
  }
}

// Export the serverless handler
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  await connectToDatabase();
  return handler(event, context);
};
