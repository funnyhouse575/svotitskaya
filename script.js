document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feature-card').forEach(card => {
        const bgImage = card.getAttribute('data-bg');
        if (bgImage) {
            card.style.setProperty('--bg-image', `url('images/${bgImage}')`);
        }
    });
    const burger = document.querySelector('.burger-emoji');
    const photo = document.querySelector('.teacher-photo');
    const heroImage = document.querySelector('.hero-image');
    let eatCount = 0;
    let currentScale = 1;

    burger.style.cursor = 'pointer';

    // Функция проверки столкновения
    function checkCollision() {
        const photoRect = photo.getBoundingClientRect();

        // Проверяем столкновение с бургером
        const burgerRect = burger.getBoundingClientRect();
        const burgerCollision = !(photoRect.right < burgerRect.left ||
                                photoRect.left > burgerRect.right ||
                                photoRect.bottom < burgerRect.top ||
                                photoRect.top > burgerRect.bottom);

        if (burgerCollision) {
            eatEverything();
            return;
        }

        // Обычные элементы для поедания
        const elementsToEat = document.querySelectorAll(`
            .feature-card,
            .experience-card,
            .timeline-item,
            .contact-item,
            .schedule-item,
            .hero-text p:not(.subtitle),
            .section h2,
            .footer
        `);

        elementsToEat.forEach(element => {
            if (element.classList.contains('eaten')) return;

            const elementRect = element.getBoundingClientRect();

            const collision = !(photoRect.right < elementRect.left + 50 ||
                              photoRect.left > elementRect.right - 50 ||
                              photoRect.bottom < elementRect.top + 30 ||
                              photoRect.top > elementRect.bottom - 30);

            if (collision && elementRect.width > 10 && elementRect.height > 10) {
                eatElement(element);
            }
        });
    }

    // Функция "съедания" элемента
    function eatElement(element) {
        element.classList.add('eaten');

        element.style.transition = 'all 1.5s ease';
        element.style.transform = 'scale(0.8) rotate(10deg)';
        element.style.opacity = '0.7';

        setTimeout(() => {
            element.style.transform = 'scale(0) rotate(45deg)';
            element.style.opacity = '0';
        }, 300);

        setTimeout(() => {
            if (element.parentNode) {
                element.style.display = 'none';
            }
        }, 1800);
    }

    // Функция съедания ВСЕГО
    function eatEverything() {
        // Прячем бургер
        burger.style.display = 'none';

        // Съедаем все элементы кроме фото и его контейнера
        const allElements = document.querySelectorAll('body > *:not(.hero):not(.hero-image):not(.teacher-photo)');

        allElements.forEach(element => {
            if (element === photo || element === burger || element === heroImage) return;

            if (!element.classList.contains('eaten') && element.style.display !== 'none') {
                element.style.transition = 'all 2s ease';
                element.style.transform = 'scale(0) rotate(360deg)';
                element.style.opacity = '0';

                setTimeout(() => {
                    if (element.parentNode && element.style.display !== 'none') {
                        element.style.display = 'none';
                    }
                }, 2000);
            }
        });

        // Делаем белый фон и центрируем фото
        setTimeout(() => {
            document.body.classList.add('final-state');
        }, 1000);
    }

    burger.addEventListener('click', function() {
        // Создаем случайный эмодзи
        const emojis = ['🍔', '🍟', '🥤'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Создаем летящий эмодзи
        const flyingEmoji = document.createElement('div');
        flyingEmoji.textContent = randomEmoji;
        flyingEmoji.style.cssText = `
            position: fixed;
            font-size: 2rem;
            z-index: 1000;
            pointer-events: none;
            transition: all 1s ease-in-out;
        `;

        // Начальная позиция (где бургер)
        const burgerRect = burger.getBoundingClientRect();
        flyingEmoji.style.left = burgerRect.left + 'px';
        flyingEmoji.style.top = burgerRect.top + 'px';

        document.body.appendChild(flyingEmoji);

        // Анимация к фото
        setTimeout(() => {
            const photoRect = photo.getBoundingClientRect();
            flyingEmoji.style.left = photoRect.left + photoRect.width / 2 + 'px';
            flyingEmoji.style.top = photoRect.top + photoRect.height / 2 + 'px';
            flyingEmoji.style.opacity = '0';
            flyingEmoji.style.transform = 'scale(0.5)';
        }, 50);

        // Увеличиваем фото и проверяем столкновения
        setTimeout(() => {
            flyingEmoji.remove();
            eatCount++;

            // Увеличиваем фото на 8% каждый раз БЕСКОНЕЧНО
            currentScale = 1 + (eatCount * 0.08);
            photo.style.transform = `scale(${currentScale})`;
            photo.style.transition = 'transform 1.2s ease';

            // После увеличения проверяем столкновения с задержкой
            setTimeout(() => {
                checkCollision();
            }, 1200);
        }, 1100);
    });
});