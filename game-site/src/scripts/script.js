window.onload = function() {
  var burgerMenu = document.querySelector('.burger-menu__checkbox');
  var logo = document.querySelector('.header__logo');
  var langPanel = document.querySelector('.header__lang-list');
  var nav = document.querySelector('.header__nav');

  burgerMenu.addEventListener('change', function() {
    logo.classList.toggle('display-none');
    langPanel.classList.toggle('display-none');
    nav.classList.toggle('display-on');
  });

  // function hideElem() {
  //   function() {
  //   logo.classList.toggle('display-none');
  //   langPanel.classList.toggle('display-none');
  //   }
  // }
};
