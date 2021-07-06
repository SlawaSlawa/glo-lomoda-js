'use strict';
const headerCityButton = document.querySelector('.header__city-button');

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите Ваш город');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
});

// blocked scroll

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
            position: fixed;
            top: ${-window.scrollY}px;
            left: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            padding-right: ${widthScroll}px;
    `;
};

const enableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY
    })
};

// modal window

const subheaderСart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
};

subheaderСart.addEventListener('click', cartModalOpen);

document.addEventListener('keyup', (evt) => {
    if (evt.key === 'Escape') {
        cartModalClose();
    }
});

cartOverlay.addEventListener('click', (evt) => {
    const target = evt.target;

    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose();
    }
});