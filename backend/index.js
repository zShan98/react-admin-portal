const app = require('./app');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;

  async function start() {
    try {
      await db.connect();
      app.listen(port, () => {
        console.log(`Server listening on port ${port}\nhttp://localhost:${port}`);
      });
    } catch (error) {
      console.error('index.js:', error);
    }
  }

  start();
