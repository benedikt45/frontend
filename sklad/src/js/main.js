
window.onload = function() {
  function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  let blocks = document.querySelectorAll('.block');

  for (let i of blocks) {
    i.style.right = getRandomInt(330) + 'px';
    i.style.bottom = getRandomInt(680) + 'px';
  }
}
