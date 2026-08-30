document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    // Базовый адрес вашего сервера на Render
    const TARGET_BACKEND = "https://onrender.com"; 
    
    // Подключаем элитный публичный прокси-сервер для обхода сетевых ограничений мобильных браузеров
    const PROXY_URL = "https://allorigins.win";
    
    const FULL_URL = PROXY_URL + encodeURIComponent(`${TARGET_BACKEND}/api/probe`);

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
        log.innerHTML = `<div>[INFO] Инициализация сканирования цели: ${cleanNumber}</div>`;
        log.innerHTML += `<div>[PROXY] Запуск защищенного туннеля данных...</div>`;
        log.innerHTML += `<div style="color: #00d2ff;">[CONNECT] Отправка запроса в обход блокировок на Python Core...</div>`;

        try {
            // Шлем запрос через прокси-туннель
            const response = await fetch(FULL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone: cleanNumber })
            });

            if (!response.ok) throw new Error(`Код сетевой ошибки: ${response.status}`);
            
            const data = await response.json();
            
            log.innerHTML += `<div style="color: #00ff66;">[SUCCESS] Защищенный шлюз ответил успешно! Данные получены.</div>`;

            setTimeout(() => {
                terminal.classList.add('hidden');

                // Запись реальных данных, полученных через прокси от Python
                document.getElementById('resRegion').textContent = data.meta.region || "Не определен";
                document.getElementById('resOperator').textContent = data.meta.operator || "Не определен";
                document.getElementById('resName').textContent = data.leaks.suggested_name || "Не найдено";
                document.getElementById('resEmail').textContent = data.leaks.associated_email || "Не найдено";

                report.classList.remove('hidden');
            }, 800);

        } catch (error) {
            log.innerHTML += `<div style="color: #ff5f56; margin-top: 10px; font-weight: bold;">[ОШИБКА ШЛЮЗА]: Сервер в режиме загрузки / Просыпается.</div>`;
            log.innerHTML += `<div style="color: #ffbd2e; font-size: 0.9rem; margin-top: 5px;">Подождите 15-20 секунд и нажмите кнопку «Начать поиск» еще раз. Туннель прогреет сервер.</div>`;
        }
    });
});
