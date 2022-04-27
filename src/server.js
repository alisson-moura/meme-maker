const { resolve } = require('path')
const express = require('express')
require('express-async-errors')
const expressNunjucks = require('express-nunjucks');

const { main } = require('./index');
const { unlink, readdir } = require('fs/promises');

const app = express();
const isDev = app.get('env') === 'development';

app.use(express.json())
app.use(express.urlencoded())
app.set('views', __dirname + '/views');
expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});

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

app.listen(80);


