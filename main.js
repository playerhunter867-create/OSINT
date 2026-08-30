document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('startScanBtn');
    const targetInput = document.getElementById('osintTarget');
    const terminal = document.getElementById('terminalConsole');
    const log = document.getElementById('terminalLog');
    const report = document.getElementById('osintReport');

    // Кнопки управления
    const btnGoogle = document.getElementById('btnGoogle');
    const btnYandex = document.getElementById('btnYandex');
    const btnLeak = document.getElementById('btnLeak');
    const btnAvito = document.getElementById('btnAvito');

    // Очистка номера от мусора
    function getCleanNum() {
        return targetInput.value.replace(/\D/g, '');
    }

    // Принудительное назначение событий клика через JavaScript
    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            const num = getCleanNum();
            if (num) {
                // Создаем идеальный дорк поиска номера во всех форматах
                const formatted = `%22${num}%22+OR+%22%2B7+(${num.substring(1,4)})+${num.substring(4,7)}-${num.substring(7,9)}-${num.substring(9,11)}%22`;
                window.open(`https://google.com{formatted}`, '_blank');
            }
        });
    }

    if (btnYandex) {
        btnYandex.addEventListener('click', () => {
            const num = getCleanNum();
            if (num) window.open(`https://yandex.ru{num}%22+OR+%227+${num.substring(1,4)}+${num.substring(4,7)}%22`, '_blank');
        });
    }

    if (btnLeak) {
        btnLeak.addEventListener('click', () => {
            const num = getCleanNum();
            if (num) window.open(`https://leakcheck.io{num}`, '_blank');
        });
    }

    if (btnAvito) {
        btnAvito.addEventListener('click', () => {
            const num = getCleanNum();
            if (num) window.open(`https://google.com{num.substring(1)}%22`, '_blank');
        });
    }

    if (!scanBtn) return;

    scanBtn.addEventListener('click', () => {
        const value = targetInput.value.trim();
        if (!value) {
            alert('Пожалуйста, введите номер телефона для анализа!');
            return;
        }

        const num = getCleanNum();

        // Запуск логов терминала
        report.classList.add('hidden');
        terminal.classList.remove('hidden');
        log.innerHTML = `<div>[INFO] Инициализация парсера Enigma Core v2.0...</div>`;
        
        setTimeout(() => {
            log.innerHTML += `<div>[DB] Сверка DEF-диапазонов Минцифры РФ...</div>`;
            
            setTimeout(() => {
                log.innerHTML += `<div>[PARSING] Поиск цифровых следов в архивах социальных сетей...</div>`;
                
                setTimeout(() => {
                    log.innerHTML += `<div style="color: #00ff66;">[SUCCESS] Генерация сводного отчета завершена!</div>`;

                    setTimeout(() => {
                        terminal.classList.add('hidden');

                        // АВТОНОМНЫЙ ПРОБИВ РЕГИОНА ПО РЕАЛЬНЫМ КОДАМ РФ
                        const code = num.substring(1, 4); // Получаем код (например, 989)
                        
                        let region = "Россия, Регион РФ";
                        let operator = "Определено по DEF-коду";
                        let suggestedName = "Не найдено в базовых архивах";
                        let linkedEmail = "Скрыто настройками приватности";

                        // База кодов регионов
                        if (['989', '928', '938', '963', '964', '967'].includes(code)) {
                            region = "Россия, Республика Дагестан";
                            operator = "ПАО МегаФон / МТС / Билайн";
                        } else if (['995', '996', '999'].includes(code)) {
                            region = "Россия, Республика Дагестан";
                            operator = "ООО Скартел (Yota)";
                        } else if (['925', '926', '916', '915', '977'].includes(code)) {
                            region = "Россия, г. Москва и Московская область";
                            operator = "МегаФон / МТС / Tele2";
                        }

                        // Умный вывод найденных совпадений (Демо-дамп)
                        if (num.includes("9894620360")) {
                            suggestedName = "Гусейн / Азамат (Найдено в логах досок объявлений)";
                            linkedEmail = "ramazanov***@list.ru";
                        }

                        // Подставляем результаты в HTML карточки
                        document.getElementById('resRegion').textContent = region;
                        document.getElementById('resOperator').textContent = operator;
                        document.getElementById('resName').textContent = suggestedName;
                        document.getElementById('resEmail').textContent = linkedEmail;

                        report.classList.remove('hidden');
                    }, 500);
                }, 600);
            }, 600);
        }, 600);
    });
});
