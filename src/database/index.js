const sqlite3 = require('sqlite3');

function connection(dbfile = process.env.DB_FILE) {
  if (dbfile !== undefined) {
    const db = new sqlite3.Database(dbfile, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
    return db;
  }
  throw new Error('Invalid database file');
}

const query = async ({ command, binds = {}, method = 'all' }) => new Promise((resolve, reject) => {
  const db = connection();
  db[method](command, binds, (err, result) => {
    if (err) reject(err);

    db.close();
    resolve(result);
  });
});

module.exports = { connection, query };
