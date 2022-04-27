const $active = document.getElementById('active')
const $files = document.getElementsByClassName('files')
const $file = document.getElementById('file')

//set first file
$active.setAttribute('src', $files.item(0).src)
$file.value = $files.item(0).alt

// add event on files
for (let i = 0; i < $files.length; i++) {
  $files.item(i).addEventListener('click', e => {
    const src = e.target.attributes.src.value
    $active.setAttribute('src', src)
    $file.value = e.target.attributes.alt.value
  })
}

