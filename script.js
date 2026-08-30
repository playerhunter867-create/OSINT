document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('osintSearch');
    const targetInput = document.getElementById('osintTarget');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.category-section');

    // 1. ЛОГИКА ЖИВОГО ПОИСКА/ФИЛЬТРАЦИИ КАРТОЧЕК
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

                if (visibleCardsInSection === 0 && query !== '') {
                    section.classList.add('hidden');
                } else {
                    section.classList.remove('hidden');
                }
            });
        });
    }

    // 2. НАДЕЖНЫЙ ПЕРЕХОД ПО КЛИКУ НА КАРТОЧКУ С НОМЕРОМ
    cards.forEach(card => {
        if (card.tagName !== 'A') return;

        card.addEventListener('click', (e) => {
            const value = targetInput ? targetInput.value.trim() : '';
            if (!value) return; // Если номер не введен, карточка работает как обычная ссылка

            const cleanNumber = value.replace(/\D/g, '');
            const baseHref = card.getAttribute('href');
            let targetUrl = baseHref;

            // Формируем точные ссылки под поисковые системы
            if (baseHref.includes('google.com')) {
                e.preventDefault();
                targetUrl = `https://google.com{cleanNumber}%22+OR+%22%2B7+${cleanNumber.substring(1)}%22`;
                window.open(targetUrl, '_blank');
            } else if (baseHref.includes('yandex.ru')) {
                e.preventDefault();
                targetUrl = `https://yandex.ru{cleanNumber}%22`;
                window.open(targetUrl, '_blank');
            } else if (baseHref.includes('duckduckgo.com')) {
                e.preventDefault();
                targetUrl = `https://duckduckgo.com{cleanNumber}%22`;
                window.open(targetUrl, '_blank');
            } else if (baseHref.includes('intelx.io')) {
                e.preventDefault();
                targetUrl = `https://intelx.io{cleanNumber}`;
                window.open(targetUrl, '_blank');
            } else if (baseHref.includes('leakcheck.io')) {
                e.preventDefault();
                targetUrl = `https://leakcheck.io{cleanNumber}`;
                window.open(targetUrl, '_blank');
            } else if (baseHref.includes('numlookup.com')) {
                e.preventDefault();
                targetUrl = `https://numlookup.com{cleanNumber}`;
                window.open(targetUrl, '_blank');
            }
        });
    });
});
