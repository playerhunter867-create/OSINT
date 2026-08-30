document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    if (!scanBtn) return;

    scanBtn.addEventListener('click', () => {
        const value = targetInput.value.trim();
        if (!value) {
            alert('Пожалуйста, введите целевой номер телефона!');
            return;
        }

        // Очищаем номер: оставляем только цифры (например, 79641619164)
        const cleanNumber = value.replace(/\D/g, '');

        // Скрываем прошлые результаты и запускаем анимацию терминала
        report.classList.add('hidden');
        terminal.classList.remove('hidden');
        log.innerHTML = '';

        const logs = [
            `[INFO] Инициализация ядра Enigma Core v4.1...`,
            `[CONNECT] Подключение к модулям внешнего поиска... Успешно.`,
            `[GENERATE] Сборка поисковых дорков для ключа: ${cleanNumber}`,
            `[READY] Ссылки для автоматического пробива сформированы.`
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                log.innerHTML += `<div>${logs[index]}</div>`;
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    terminal.classList.add('hidden');
                    
                    // Меняем текст в сводке, чтобы показать, какой номер сейчас в работе
                    document.getElementById('resRegion').textContent = "Сгенерировано для номера: " + cleanNumber;
                    document.getElementById('resOperator').textContent = "Готово к переходу в базы";
                    document.getElementById('resName').textContent = "[Ждет ручного дочеса]";
                    document.getElementById('resEmail').textContent = "[Проверьте ссылки ниже]";

                    // НАСТОЯЩАЯ АВТОМАТИЗАЦИЯ: подставляем реальный номер в ссылки поисковиков
                    document.getElementById('lnGoogle').href = `https://google.com{cleanNumber}%22+OR+%22%2B7+${cleanNumber.substring(1,4)}+${cleanNumber.substring(4,7)}-${cleanNumber.substring(7,9)}-${cleanNumber.substring(9,11)}%22`;
                    document.getElementById('lnYandex').href = `https://yandex.ru{cleanNumber}%22`;
                    document.getElementById('lnLeak').href = `https://leakcheck.io{cleanNumber}`;

                    // Показываем блок со ссылками
                    report.classList.remove('hidden');
                }, 500);
            }
        }, 400);
    });
});
