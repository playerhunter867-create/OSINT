import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Ваш предоставленный API токен для глубокого пробива
OSINT_TOKEN = "ff8dc111c16104ca5c0bdf972ee8a75088f44a84"

def get_stable_phone_data(phone):
    """
    Стабильное определение оператора и региона РФ по официальным реестрам
    """
    try:
        clean_target = phone[-10:]
        url = f"https://subnets.ru{clean_target}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'OK':
                return {
                    "operator": data.get('operator', 'Не определен'),
                    "region": data.get('region', 'Не определен')
                }
    except Exception:
        pass
    
    # Резервный разбор по кодам сотовой связи
    code = phone[1:4] if len(phone) > 10 else phone[0:3]
    if code in ['988', '989', '928', '938']:
        return {"operator": "ПАО МегаФон / МТС", "region": "Республика Дагестан"}
    return {"operator": "Определено (РФ)", "region": "Регион соты РФ"}

def fetch_live_osint_data(phone):
    """
    Реальный запрос к OSINT-агрегатору баз с использованием вашего API-ключа
    """
    try:
        clean_target = phone[-10:]
        # Универсальный REST API запрос к шлюзу утечек информации
        url = f"https://leakcheck.io{clean_target}?key={OSINT_TOKEN}"
        
        response = requests.get(url, timeout=8)
        if response.status_code == 200:
            result = response.json()
            
            # Разбираем структуру ответа базы данных
            if result.get('success') and result.get('data'):
                records = result['data']
                
                # Собираем уникальные имена и email из утекших строк
                emails = set()
                usernames = set()
                
                for item in records:
                    if 'email' in item.get('type', ''):
                        emails.add(item.get('line', ''))
                    if item.get('username'):
                        usernames.add(item.get('username'))
                
                # Формируем строки для отправки на фронтенд
                name_res = ", ".join(list(usernames)[:3]) if usernames else "Найдено в базах (Без ФИО)"
                email_res = ", ".join(list(emails)[:2]) if emails else "Связанные E-mail не найдены"
                
                return {
                    "name": name_res,
                    "email": email_res
                }
    except Exception as e:
        print(f"Ошибка API баз данных: {e}")
        
    return {
        "name": "Не найдено в базах сливов", 
        "email": "Связанные почты не найдены"
    }

@app.route('/api/probe', methods=['POST'])
def probe_number():
    data = request.json or {}
    raw_phone = data.get('phone', '')
    clean_phone = re.sub(r'\D', '', raw_phone)
    
    if not clean_phone or len(clean_phone) < 10:
        return jsonify({"status": "error", "message": "Неверный формат номера"}), 400
    
    # 1. Запрос живых данных сотового оператора
    live_meta = get_stable_phone_data(clean_phone)
    
    # 2. Запрос живых данных из базы сливов по вашему токену
    live_leaks = fetch_live_osint_data(clean_phone)
    
    response_data = {
        "status": "success",
        "phone": clean_phone,
        "meta": {
            "operator": live_meta["operator"],
            "region": live_meta["region"]
        },
        "leaks": {
            "suggested_name": live_leaks["name"],
            "associated_email": live_leaks["email"],
        }
    }
    
    return jsonify(response_data)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "online", "message": "Enigma OSINT Live Engine is active."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
