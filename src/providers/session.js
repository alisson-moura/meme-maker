const sessions = require('express-session');
const sqlite3 = require('sqlite3');
const sqliteStoreFactory = require('express-session-sqlite').default;

const SqliteStore = sqliteStoreFactory(sessions);
const oneDay = 1000 * 60 * 60 * 24;

const sessionConfig = sessions({
  store: new SqliteStore({
    driver: sqlite3.Database,
    path: process.env.DB_FILE,
    ttl: oneDay,
  }),
  secret: 'adsaddasdasdasdadasdasdasdw3dasd',
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
  resave: false,
});

module.exports = sessionConfig;
