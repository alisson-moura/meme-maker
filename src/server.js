require('dotenv').config();
const { resolve } = require('path');
const { readdir } = require('fs').promises;
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const helmet = require('helmet');
const expressNunjucks = require('express-nunjucks');
const multer = require('multer');
const crypto = require('crypto');

const { logger } = require('./logger');

const app = express();
const isDev = process.env.NODE_ENV === 'development';

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', resolve(__dirname, '..', 'views'));
expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, resolve(__dirname, '..', 'public', 'memes'));
  },
  filename(req, file, cb) {
    // Extração da extensão do arquivo original:
    const extensaoArquivo = file.originalname.split('.')[1];

    // Cria um código randômico que será o nome do arquivo
    const novoNomeArquivo = crypto
      .randomBytes(32)
      .toString('hex');

    // Indica o novo nome do arquivo:
    cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
  },
});

const upload = multer({ storage });

app.use('/public', express.static(resolve(__dirname, '..', 'public')));

app.get('/', async (req, res) => {
  const files = await readdir(resolve(__dirname, '..', 'public', 'memes'));
  res.render('index', { files });
});

/*
app.post('/create-meme', async (req, res) => {
  const { file, textTop, textBottom } = req.body;
  return res.download(result, async (_err) => {
    await unlink(result);
  });
}); */

app.post(
  '/send-file',
  upload.single('sendFile'),
  async (req, res) => res.redirect('/'),
);

app.use((err, req, res, _next) => {
  logger.log({ level: 'error', message: err.message, stack: err.stack });
  return res.render('server-error');
});

app.listen(process.env.PORT);
