document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    // !!! ВСТАВЬТЕ СЮДА ВАШУ ССЫЛКУ С RENDER ВНУТРЬ КАВЫЧЕК !!!
    const BACKEND_URL = "https://osint-r83a.onrender.com/"; 

    if (!scanBtn) return;

    scanBtn.addEventListener('click', async () => {
        const value = targetInput.value.trim();
        if (!value) {
            alert('Пожалуйста, введите целевой номер телефона!');
            return;
        }

        const cleanNumber = value.replace(/\D/g, '');

        // Анимация запуска терминала
        report.classList.add('hidden');
        terminal.classList.remove('hidden');
        log.innerHTML = `<div>[INFO] Инициализация ядра Enigma Core...</div>`;

        try {
            log.innerHTML += `<div>[CONNECT] Запрос к Python-серверу баз данных...</div>`;
            
            // Отправляем реальный запрос на наш бэкенд на Render
            const response = await fetch(`${BACKEND_URL}/api/probe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone: cleanNumber })
            });

            if (!response.ok) throw new Error('Ошибка ответа сервера');
            
            const data = await response.json();

            log.innerHTML += `<div>[SUCCESS] Данные получены. Декодирование отчета...</div>`;

            setTimeout(() => {
                terminal.classList.add('hidden');

                // Подставляем НАСТОЯЩИЕ данные от Python в нашу таблицу на экране!
                document.getElementById('resRegion').textContent = data.meta.region || "Не определен";
                document.getElementById('resOperator').textContent = data.meta.operator || "Не определен";
                document.getElementById('resName').textContent = data.leaks.suggested_name || "Не найдено";
                document.getElementById('resEmail').textContent = data.leaks.associated_email || "Не найдено";

                // Адаптируем внешние ссылки-дорки под новый чистый номер
                document.getElementById('lnGoogle').href = `https://google.com{cleanNumber}%22`;
                document.getElementById('lnYandex').href = `https://yandex.ru{cleanNumber}%22`;
                document.getElementById('lnLeak').href = `https://leakcheck.io{cleanNumber}`;

                report.classList.remove('hidden');
            }, 1000);

        } catch (error) {
            log.innerHTML += `<div style="color: #ff5f56;">[ERROR] Не удалось связаться с бэкендом: ${error.message}</div>`;
        }
    });
});
