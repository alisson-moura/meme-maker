const { access } = require('fs/promises')
const { resolve } = require('path')
const sharp = require('sharp')

const config = {
  folder: resolve(__dirname, '..', 'public', 'memes'),
  fileName: function (name) {
    return resolve(this.folder, name)
  }
}

const validate = opts => {
  if (!(opts.textBottom) && !(opts.textTop)) {
    return new Error('Ao menos um texto deve ser fornecido')
  }

  if (opts.file == undefined) {
    return new Error('Arquivo inválido')
  }

  if (opts.textBottom && opts.textBottom.length > 30 * 6) {
    return new Error('O texto fornecido é muito grande')
  }

  if (opts.textTop && opts.textTop.length > 30 * 6) {
    return new Error('O texto fornecido é muito grande')
  }


  const linesTop = []
  const linesBottom = []

  if (opts.textTop && opts.textTop.length > 30) {
    const lineSize = Math.ceil(opts.textTop.length / 30)
    for (let i = 0; i < lineSize; i++) {
      linesTop[i] = opts.textTop.slice(30 * i, (30 * (i + 1)))
    }
  } else if (opts.textTop) {
    linesTop.push(opts.textTop)
  }

  if (opts.textBottom && opts.textBottom.length > 30) {
    const lineSize = Math.ceil(opts.textBottom.length / 30)
    for (let i = 0; i < lineSize; i++) {
      linesTop[i] = opts.textBottom.slice(30 * i, (30 * (i + 1)))
    }
  } else if (opts.textBottom) {
    linesBottom.push(opts.textBottom)
  }

  return { ...opts, linesTop, linesBottom }

}

const svgText = (arrayText, width, height) => {

  const tag = arrayText.map((l, i) => `<text x="50%" y="${15 * (i + 1)}%" text-anchor="middle"  class="title">${l}</text>`)

  return `
  <svg width="${width}px" height="${height}px">
   <style>
    .title { fill: #fff; 
      font-family: "Roboto";
      font-size: 50px; 
      font-weight: bold;}
   </style>
    ${tag.join('\n')}
  </svg>
  `
}



const main = async (opts) => {
  const resultValidate = validate(opts)
  if (resultValidate instanceof Error) {
    throw new Error()
  }

  const file = config.fileName(resultValidate.file)
  const textTop = resultValidate.linesTop
  const textBottom = resultValidate.linesBottom

  const image = sharp(file)
  const meta = await image.metadata()
  const width = meta.width - 10
  const height = Math.floor(0.6 * meta.height)
  const bottom = Math.floor(meta.height - (meta.height * 0.2))
  const top = 30

  const svgTop = textTop.length > 0
    ? svgText(textTop, width, height)
    : null

  const svgBottom = textBottom.length > 0
    ? svgText(textBottom, width, height)
    : null



  if (svgTop && svgBottom) {
    image.composite([
      {
        input: Buffer.from(svgTop),
        top: top,
        left: 0,
      },
      {
        input: Buffer.from(svgBottom),
        top: bottom,
        left: 0
      }
    ])
  } else if (svgTop) {
    image.composite([
      {
        input: Buffer.from(svgTop),
        top: top,
        left: 0,
      }
    ])
  } else if (svgBottom) {
    image.composite([
      {
        input: Buffer.from(svgBottom),
        top: bottom,
        left: 0
      }
    ])
  }



  await image.toFile(config.fileName('out.jpg'))
  return config.fileName('out.jpg')
}

module.exports = { main }