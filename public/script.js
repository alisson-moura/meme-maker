const $active = document.getElementById('active');
const $files = document.getElementsByClassName('files');

if ($files.length > 0) {
  // set first file
  $active.setAttribute('src', $files.item(0).src);

  // add event on files
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < $files.length; i++) {
    $files.item(i).addEventListener('click', (e) => {
      const src = e.target.attributes.src.value;
      $active.setAttribute('src', src);
    });
  }
}
