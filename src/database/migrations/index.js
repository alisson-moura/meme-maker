/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
require('dotenv').config();
const fs = require('fs/promises');
const { resolve } = require('path');
const { logger } = require('../../providers/logger');
const { query } = require('../index');

async function migrate() {
  const files = await fs.readdir(__dirname);

  try {
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const content = await fs.readFile(resolve(__dirname, file), 'utf8');
        await query({
          command: content,
          method: 'run',
        });
      }
    }
  } catch (error) {
    logger.log({ level: 'error', message: error });
    process.exit(1);
  }
}

migrate();
