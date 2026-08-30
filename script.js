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

        const cleanNumber = value.replace(/\D/g, '');

        // Скрываем прошлый отчет и активируем консоль
        report.classList.add('hidden');
        terminal.classList.remove('hidden');
        log.innerHTML = '';

        // Набор логов симуляции ИБ-поиска
        const logs = [
            `[INFO] Инициализация ядра Enigma Core v4.1...`,
            `[CONNECT] Соединение со шлюзом баз утечек... Успешно.`,
            `[SEARCH] Поиск совпадений по ключу: phone_clean = ${cleanNumber}`,
            `[PARSING] Сканирование архивов: mail_ru_2022, vk_dump, ok_users...`,
            `[DECRYPT] Анализ метаданных и связей социальных сетей...`,
            `[SUCCESS] Декодирование завершено. Формирование сводного отчета...`
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                log.innerHTML += `<div>${logs[index]}</div>`;
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    // Прячем консоль и выводим элитную сводку результатов
                    terminal.classList.add('hidden');
                    
                    // Обновляем внешние ссылки дорков для ручного дочеса
                    document.getElementById('lnGoogle').href = `https://google.com{cleanNumber}%22`;
                    document.getElementById('lnYandex').href = `https://yandex.ru{cleanNumber}%22`;
                    document.getElementById('lnLeak').href = `https://leakcheck.io{cleanNumber}`;

                    report.classList.remove('hidden');
                }, 800);
            }
        }, 600);
    });
});
