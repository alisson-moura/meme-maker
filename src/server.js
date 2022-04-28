const { resolve } = require('path')
const {unlink, readdir } = require('fs').promises;
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const expressNunjucks = require('express-nunjucks');
const multer = require('multer')

const { main } = require('./index');


const app = express();
const isDev = app.get('env') === 'development';

app.use(cors())
app.use(express.json())

app.set('views', __dirname + '/views');
expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, '..', 'public', 'memes'))
  },
  filename: function (req, file, cb) {
    // Extração da extensão do arquivo original:
    const extensaoArquivo = file.originalname.split('.')[1];

    // Cria um código randômico que será o nome do arquivo
    const novoNomeArquivo = require('crypto')
      .randomBytes(32)
      .toString('hex');

    // Indica o novo nome do arquivo:
    cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
  }
});

const upload = multer({ storage });

app.use('/public', express.static(resolve(__dirname, '..', 'public')))

app.get('/', async (req, res) => {
  const files = await readdir(resolve(__dirname, '..', 'public', 'memes'))
  res.render('index', { files });
});


app.post('/create-meme', async (req, res) => {
  const { file, textTop, textBottom } = req.body
  console.log(file, textBottom, textTop)
  const result = await main({ file, textBottom, textTop })
  return res.download(result, async err => {
    await unlink(result)
  })
})

app.post('/send-file', upload.single('sendFile'), async (req, res) => {
  return res.redirect('/')
})

app.listen(3000);


