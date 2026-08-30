document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('osintSearch');
    const targetInput = document.getElementById('osintTarget');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.category-section');

    // Сохраняем исходные ссылки карточек, чтобы обновлять их на лету
    const originalHrefs = new Map();
    cards.forEach((card, index) => {
        if (card.tagName === 'A') {
            originalHrefs.set(card, card.href);
        }
    });

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

    // 2. АВТОМАТИЧЕСКАЯ МОДИФИКАЦИЯ ССЫЛОК ПОД ВВЕДЕННЫЙ НОМЕР
    if (targetInput) {
        targetInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            const cleanNumber = value.replace(/\D/g, ''); // Только цифры для дорков

            cards.forEach(card => {
                if (card.tagName !== 'A') return;

                const baseHref = originalHrefs.get(card);

                if (!value) {
                    // Если поле пустое — возвращаем стандартную ссылку на главную сервиса
                    card.href = baseHref;
                    return;
                }

                // Перестраиваем ссылки для ключевых платформ пробива
                if (baseHref.includes('google.com')) {
                    card.href = `https://google.com{cleanNumber}%22+OR+%22%2B7+${cleanNumber.substring(1)}%22`;
                } else if (baseHref.includes('yandex.ru')) {
                    card.href = `https://yandex.ru{cleanNumber}%22`;
                } else if (baseHref.includes('duckduckgo.com')) {
                    card.href = `https://duckduckgo.com{cleanNumber}%22`;
                } else if (baseHref.includes('bing.com')) {
                    card.href = `https://bing.com{cleanNumber}%22`;
                } else if (baseHref.includes('intelx.io')) {
                    card.href = `https://intelx.io{cleanNumber}`;
                } else if (baseHref.includes('leakcheck.io')) {
                    card.href = `https://leakcheck.io{cleanNumber}`;
                } else if (baseHref.includes('numlookup.com')) {
                    card.href = `https://numlookup.com{cleanNumber}`;
                }
            });
        });
    }
});
