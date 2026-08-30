document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    const BACKEND_URL = "https://onrender.com"; 

    // Глобальные функции для открытия поисковиков (срабатывают моментально без кэширования)
    window.openGoogle = function() {
        const value = targetInput.value.trim();
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber) {
            window.open(`https://google.com{cleanNumber}%22`, '_blank');
        } else {
            alert('Сначала введите номер!');
        }
    };

    window.openYandex = function() {
        const value = targetInput.value.trim();
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber) {
            window.open(`https://yandex.ru{cleanNumber}%22`, '_blank');
        } else {
            alert('Сначала введите номер!');
        }
    };

    window.openLeakCheck = function() {
        const value = targetInput.value.trim();
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber) {
            window.open(`https://leakcheck.io{cleanNumber}`, '_blank');
        } else {
            alert('Сначала введите номер!');
        }
    };

    if (!scanBtn) return;

    scanBtn.addEventListener('click', async () => {
        const value = targetInput.value.trim();
        if (!value) {
            alert('Пожалуйста, введите номер телефона!');
            return;
        }

        const cleanNumber = value.replace(/\D/g, '');

        report.classList.add('hidden');
        terminal.classList.remove('hidden');
        log.innerHTML = `<div>[INFO] Старт проверки номера: ${cleanNumber}</div>`;
        log.innerHTML += `<div>[CONNECT] Подключение к Python-серверу Render...</div>`;
        log.innerHTML += `<div style="color: #00d2ff;">[WAIT] Бесплатный сервер просыпается. Это может занять до 40-50 секунд при первом запросе. Пожалуйста, не закрывайте страницу...</div>`;

        try {
            // Отправляем запрос без искусственных ограничений таймаута
            const response = await fetch(`${BACKEND_URL}/api/probe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone: cleanNumber })
            });

            if (!response.ok) throw new Error(`Ответ сервера: ${response.status}`);
            
            const data = await response.json();
            
            log.innerHTML += `<div style="color: #00ff66;">[SUCCESS] Синхронизация с API успешна! Данные расшифрованы.</div>`;

            setTimeout(() => {
                terminal.classList.add('hidden');

                // Вывод реальных данных со шлюза Python
                document.getElementById('resRegion').textContent = data.meta.region || "Не определен";
                document.getElementById('resOperator').textContent = data.meta.operator || "Не определен";
                document.getElementById('resName').textContent = data.leaks.suggested_name || "Не найдено";
                document.getElementById('resEmail').textContent = data.leaks.associated_email || "Не найдено";

                report.classList.remove('hidden');
            }, 1000);

        } catch (error) {
            log.innerHTML += `<div style="color: #ff5f56; margin-top: 10px; font-weight: bold;">[ОШИБКА]: ${error.message}</div>`;
            log.innerHTML += `<div style="color: #ffbd2e; font-size: 0.9rem; margin-top: 5px;">Попробуйте нажать кнопку «Начать поиск» еще раз прямо сейчас. Сервер уже должен был проснуться.</div>`;
        }
    });
});
