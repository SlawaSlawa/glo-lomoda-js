'use strict';
const headerCityButton = document.querySelector('.header__city-button');
let hash = location.hash.substring(1);



const updateLocation = () => {
    const lsLocation = localStorage.getItem('lomoda-location');
    headerCityButton.textContent =
        lsLocation && lsLocation !== 'null' ?
            lsLocation : 'Ваш город?';
};

headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите Ваш город').trim();
    if (city !== null) {
        localStorage.setItem('lomoda-location', city);
    }
    updateLocation();
});

updateLocation();

// blocked scroll

const disableScroll = () => {
    if (document.disableScroll) return;
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.disableScroll = true;
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
    document.disableScroll = true;

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

// request in db

const getData = async () => {
    const data = await fetch('db.json');

    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`);
    }

};

const getGoods = (callback, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item.category === value));
            } else {
                callback(data);
            }
        })
        .catch(err => {
            console.error(err);
        });
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

try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page'
    }

    const createCard = ({ id, preview, cost, brand, name, sizes }) => {
        const li = document.createElement('li');
        li.classList.add('goods__item');
        li.innerHTML = `
        <article class="good">
            <a class="good__link-img" href="card-good.html#${id}">
                <img class="good__img" src="goods-image/${preview}" alt="${name}">
            </a>
            <div class="good__description">
                <p class="good__price">${cost} &#8381;</p>
                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                ${sizes ?
                `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span>
                    </p>`
                : ''
            }
                <a class="good__link" href="card-good.html#id${id}">Подробнее</a>
            </div>
        </article>
        `

        return li;
    };

    const setGoodsTitle = (hash) => {
        const title = document.querySelector('.goods__title');
        const navigationItems = document.querySelectorAll('.navigation__link');

        navigationItems.forEach(item => {
            if (item.hash.substr(1) === hash) {
                title.textContent = item.textContent;
            }
        });

    };

    setGoodsTitle(hash);

    const renderGoodsList = data => {
        goodsList.textContent = '';

        data.forEach(item => {
            const card = createCard(item);
            goodsList.append(card);
        });
    };

    window.addEventListener('hashchange', () => {
        hash = location.hash.substr(1);
        setGoodsTitle(hash);
        getGoods(renderGoodsList, hash);
    });

    getGoods(renderGoodsList, hash);
} catch (err) {
    console.warn(err);
}