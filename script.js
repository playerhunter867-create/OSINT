document.addEventListener('DOMContentLoaded', () => {
    // 1. ЛОГИКА ЖИВОГО ПОИСКА/ФИЛЬТРАЦИИ КАРТОЧЕК
    const searchInput = document.getElementById('osintSearch');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.category-section');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            sections.forEach(section => {
                const sectionCards = section.querySelectorAll('.card');
                let visibleCardsInSection = 0;

                sectionCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const desc = card.querySelector('p').textContent.toLowerCase();

                    if (title.includes(query) || desc.includes(query)) {
                        card.style.display = 'flex';
                        visibleCardsInSection++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Скрываем всю секцию целиком, если в ней ничего не нашлось
                if (visibleCardsInSection === 0 && query !== '') {
                    section.classList.add('hidden');
                } else {
                    section.classList.remove('hidden');
                }
            });
        });
    }

    // 2. ДИНАМИЧЕСКИЙ ПОДСТАВНОЙ НОМЕР ДЛЯ ССЫЛОК (ОПЦИОНАЛЬНО)
    // Эта часть подготавливает сайт к будущему добавлению поля ввода номера
    window.generateOsintLinks = function(phoneNumber) {
        if (!phoneNumber) return;
        
        // Очищаем номер от лишних символов (оставляем только цифры)
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        
        // Находим все ссылки на внешние поисковики и адаптируем их под дорки
        const googleCard = document.querySelector('a[href*="google.com"]');
        if (googleCard) {
            googleCard.href = `https://google.com{cleanNumber}%22+OR+%22%2B7+${cleanNumber.substring(1)}%22`;
        }

        const yandexCard = document.querySelector('a[href*="yandex.ru"]');
        if (yandexCard) {
            yandexCard.href = `https://yandex.ru{cleanNumber}%22`;
        }
    };
});
