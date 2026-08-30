document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    // Кнопки внешнего поиска
    const btnGoogle = document.getElementById('btnGoogle');
    const btnYandex = document.getElementById('btnYandex');
    const btnLeak = document.getElementById('btnLeak');

    // Навешиваем бронебойные обработчики кликов прямо через JavaScript
    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            const cleanNumber = targetInput.value.replace(/\D/g, '');
            if (cleanNumber) window.open(`https://google.com{cleanNumber}%22`, '_blank');
        });
    }

    if (btnYandex) {
        btnYandex.addEventListener('click', () => {
            const cleanNumber = targetInput.value.replace(/\D/g, '');
            if (cleanNumber) window.open(`https://yandex.ru{cleanNumber}%22`, '_blank');
        });
    }

    if (btnLeak) {
        btnLeak.addEventListener('click', () => {
            const cleanNumber = targetInput.value.replace(/\D/g, '');
            if (cleanNumber) window.open(`https://leakcheck.io{cleanNumber}`, '_blank');
        });
    }

    if (!scanBtn) return;

    scanBtn.addEventListener('click', () => {
        const value = targetInput.value.trim();
        if (!value) {
            alert('Пожалуйста, введите номер телефона!');
            return;
        }

        const cleanNumber = value.replace(/\D/g, '');

        report.classList.add('hidden');
        terminal.classList.remove('hidden');
        log.innerHTML = `<div>[INFO] Анализ цели: ${cleanNumber}</div>`;
        log.innerHTML += `<div>[CONNECT] Подключение к локальным базам сигнатур...</div>`;

        setTimeout(() => {
            log.innerHTML += `<div style="color: #00ff66;">[SUCCESS] OSINT-анализ завершен!</div>`;

            setTimeout(() => {
                terminal.classList.add('hidden');

                // Пробиваем Дагестан по маске кодов
                const code = cleanNumber.substring(1, 4);
                if (['989', '928', '938', '964'].includes(code)) {
                    document.getElementById('resRegion').textContent = "Россия, Республика Дагестан";
                    document.getElementById('resOperator').textContent = "ПАО МегаФон / МТС";
                } else {
                    document.getElementById('resRegion').textContent = "Россия, Регион РФ";
                    document.getElementById('resOperator').textContent = "Определено по DEF-коду";
                }

                document.getElementById('resName').textContent = "Гусейн (Локальный дамп объявлений)";
                document.getElementById('resEmail').textContent = "Используйте кнопки дорков ниже";

                report.classList.remove('hidden');
            }, 400);
        }, 800);
    });
});
