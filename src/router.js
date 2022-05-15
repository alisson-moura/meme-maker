const { readdir } = require('fs').promises;
const { resolve } = require('path');
const { Router } = require('express');
const { sessionMiddleware } = require('./middlewares');
const { CreateAccounController } = require('./services/CreateAccount/controller');
const { CreateSessionController } = require('./services/CreateSession/controller');

const router = Router();

// create account routes
router.get('/create-account', async (req, res) => new CreateAccounController()
  .execute(req, res, 'create-account'));
router.post('/create-account', async (req, res) => new CreateAccounController()
  .execute(req, res));

// login routes
router.get('/login', async (req, res) => new CreateSessionController()
  .execute(req, res, 'login'));
router.post('/login', async (req, res) => new CreateSessionController()
  .execute(req, res));
router.post('/logout', async (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/login');
});

router.get('/', sessionMiddleware, async (req, res) => {
  const files = await readdir(resolve(__dirname, '..', 'public', 'memes'));
  return res.render('index', { files });
});

module.exports = router;
