const menuBtn = document.getElementById('menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');

    const isOpen = nav.classList.contains('open');

    menuBtn.textContent = isOpen ? '✕' : '☰';

    menuBtn.setAttribute('aria-expanded', isOpen);
});