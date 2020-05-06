
window.onload = function() {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  let blocks = document.querySelectorAll('.block');

  for (let i of blocks) {
    i.style.left = getRandomInt(500) + 'px';
    i.style.bottom = getRandomInt(680) + 'px';
  }
}
