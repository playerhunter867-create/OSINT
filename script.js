document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    const BACKEND_URL = "https://onrender.com"; 

    window.openGoogle = function() {
        const value = targetInput.value.trim();
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber) {
            window.open(`https://google.com{cleanNumber}%22`, '_blank');
        }
    };

    window.openYandex = function() {
        const value = targetInput.value.trim();
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber) {
            window.open(`https://yandex.ru{cleanNumber}%22`, '_blank');
        }
    };

    window.openLeakCheck = function() {
        const value = targetInput.value.trim();
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber) {
            window.open(`https://leakcheck.io{cleanNumber}`, '_blank');
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
        log.innerHTML += `<div>[CONNECT] Безопасное GET-подключение к Python Core...</div>`;

        try {
            // Запрос отправляется обычным методом GET прямо в строке адреса
            const response = await fetch(`${BACKEND_URL}/api/probe/${cleanNumber}`);

            if (!response.ok) throw new Error(`Код сетевого ответа: ${response.status}`);
            
            const data = await response.json();
            log.innerHTML += `<div style="color: #00ff66;">[SUCCESS] Синхронизация успешна! Данные расшифрованы.</div>`;

            setTimeout(() => {
                terminal.classList.add('hidden');

                document.getElementById('resRegion').textContent = data.meta.region || "Не определен";
                document.getElementById('resOperator').textContent = data.meta.operator || "Не определен";
                document.getElementById('resName').textContent = data.leaks.suggested_name || "Не найдено";
                document.getElementById('resEmail').textContent = data.leaks.associated_email || "Не найдено";

                report.classList.remove('hidden');
            }, 800);

        } catch (error) {
            log.innerHTML += `<div style="color: #ff5f56; margin-top: 10px; font-weight: bold;">[ОШИБКА]: Сервер просыпается.</div>`;
            log.innerHTML += `<div style="color: #ffbd2e; font-size: 0.9rem; margin-top: 5px;">Пожалуйста, нажмите «Начать поиск» еще раз прямо сейчас. Бэкенд уже активен.</div>`;
        }
    });
});
