const $active = document.getElementById('active')
const $files = document.getElementsByClassName('files')
const $file = document.getElementById('file')

for (let i = 0; i < $files.length; i++) {
  $files.item(i).addEventListener('click', e => {
    const src = e.target.attributes.src.value
    $active.setAttribute('src', src)
    $file.value = e.target.attributes.alt.value
  })
}