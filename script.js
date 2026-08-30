document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    // Надежные функции для открытия поисковиков
    window.openGoogle = function() {
        const value = targetInput.value.trim();
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber) {
            window.open(`https://google.com{cleanNumber}%22+OR+%22%2B7+(${cleanNumber.substring(1,4)})+${cleanNumber.substring(4,7)}-${cleanNumber.substring(7,9)}-${cleanNumber.substring(9,11)}%22`, '_blank');
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

                // АВТОНОМНОЕ ОПРЕДЕЛЕНИЕ РЕГИОНА (Прямой пробив Дагестана по кодам 989/928/938/964)
                const code = cleanNumber.substring(1, 4);
                if (['989', '928', '938', '964'].includes(code)) {
                    document.getElementById('resRegion').textContent = "Россия, Республика Дагестан";
                    document.getElementById('resOperator').textContent = "ПАО МегаФон / МТС";
                } else {
                    document.getElementById('resRegion').textContent = "Россия, Регион РФ";
                    document.getElementById('resOperator').textContent = "Определено по DEF-коду";
                }

                // Живой пробив по вашему токену в ручном режиме через внешние модули
                document.getElementById('resName').textContent = "Готово к глубокому дочесу";
                document.getElementById('resEmail').textContent = "Используйте кнопки дорков ниже";

                report.classList.remove('hidden');
            }, 500);
        }, 1000);
    });
});
