/* this below is all the JS needed for the demo itself to work */
document.documentElement.classList.add('js');

addEventListener(
  'input',
  (e) => {
    let _t = e.target;

    _t.parentNode.style.setProperty('--val', +_t.value);
  },
  false,
);
