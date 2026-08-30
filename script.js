document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    const BACKEND_URL = "https://onrender.com"; 

    // Создаем глобальные функции для кнопок, чтобы обойти кэширование ссылок
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

        try {
            log.innerHTML += `<div>[CONNECT] Отправка запроса на сервер...</div>`;
            
            const response = await fetch(`${BACKEND_URL}/api/probe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone: cleanNumber })
            });

            if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
            
            const data = await response.json();
            log.innerHTML += `<div>[SUCCESS] Данные получены!</div>`;

            setTimeout(() => {
                terminal.classList.add('hidden');

                document.getElementById('resRegion').textContent = data.meta.region || "Не определен";
                document.getElementById('resOperator').textContent = data.meta.operator || "Не определен";
                document.getElementById('resName').textContent = data.leaks.suggested_name || "Не найдено";
                document.getElementById('resEmail').textContent = data.leaks.associated_email || "Не найдено";

                report.classList.remove('hidden');
            }, 500);

        } catch (error) {
            log.innerHTML += `<div style="color: #ff5f56; margin-top: 10px;">[ОШИБКА]: ${error.message}</div>`;
        }
    });
});
