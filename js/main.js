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

const getGoods = (callback, prop, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item[prop] === value));
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
        getGoods(renderGoodsList, 'category', hash);
    });

    getGoods(renderGoodsList, 'category', hash);
} catch (err) {
    console.warn(err);
}

// googs page

try {
    if (!document.querySelector('.card-good')) {
        throw 'This is not a card-good';
    }

    const cardGoodImage = document.querySelector('.card-good__image');
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodColorList = document.querySelector('.card-good__color-list');
    const cardGoodSizes = document.querySelector('.card-good__sizes');
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
    const cardGoodBuy = document.querySelector('.card-good__buy');
    const cardGoodPrice = document.querySelector('.card-good__price');
    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');

    const generateList = data => data.reduce((html, item, i) => {
        return html + `<li class="card-good__select-item" data-id="${i}">${item}</li>`;
    }, '');

    const renderCardGood = ([{ photo, cost, brand, name, sizes, color }]) => {
        cardGoodImage.src = `goods-image/${photo}`;
        cardGoodImage.alt = `${brand} ${name}`;
        cardGoodBrand.textContent = brand;
        cardGoodTitle.textContent = name;
        cardGoodPrice.textContent = `${cost} ₽`;
        if (color) {
            cardGoodColor.textContent = color[0];
            cardGoodColor.dataset.id = 0;
            cardGoodColorList.innerHTML = generateList(color);
        } else {
            cardGoodColor.style.display = 'none';
        };
        if (sizes) {
            cardGoodSizes.textContent = sizes[0];
            cardGoodSizes.dataset.id = 0;
            cardGoodSizesList.innerHTML = generateList(sizes);
        } else {
            cardGoodSizes.style.display = 'none';
        };
    };

    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', (evt) => {
            const target = evt.target;

            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open');
            }

            if (target.closest('.card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        });
    });

    getGoods(renderCardGood, 'id', hash);

} catch (err) {
    console.warn(err);
}


