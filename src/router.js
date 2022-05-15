const { readdir } = require('fs').promises;
const { resolve } = require('path');
const { Router } = require('express');
const { sessionMiddleware } = require('./middlewares');
const { CreateAccounController } = require('./services/CreateAccount/controller');
const { SessionController } = require('./services/Session/controller');

const router = Router();

router.use(sessionMiddleware);

// create account routes
router.get('/create-account', async (req, res) => new CreateAccounController()
  .execute(req, res, 'create-account'));
router.post('/create-account', async (req, res) => new CreateAccounController()
  .execute(req, res));

// login routes
router.get('/login', async (req, res) => new SessionController()
  .execute(req, res, 'login'));
router.post('/login', async (req, res) => new SessionController()
  .execute(req, res));
router.post('/logout', async (req, res) => new SessionController()
  .execute(req, res));

router.get('/', async (req, res) => {
  const files = await readdir(resolve(__dirname, '..', 'public', 'memes'));
  return res.render('index', { files });
});

module.exports = router;
