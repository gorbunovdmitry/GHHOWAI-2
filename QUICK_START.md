# ⚡ Быстрый запуск чат-приложения

## 🚀 За 2 минуты

### 1. Запуск backend (в одном терминале)

```bash
cd backend
npm install
npm start
```

### 2. Запуск frontend (в другом терминале)

```bash
# Вариант A: Простой запуск
open index.html

# Вариант B: Локальный сервер
python3 -m http.server 8000
# Откройте http://localhost:8000
```

## ✅ Проверка работы

1. **Backend работает**: http://localhost:5002/api/health
2. **Frontend работает**: откройте index.html
3. **Чат работает**: отправьте сообщение
4. **Google Sheets**: проверьте вашу таблицу

## 🔧 Настройка Google Sheets

1. Создайте Google Sheet с колонками A-D
2. Поделитесь с: `ghtest@probable-surge-471111-h5.iam.gserviceaccount.com`
3. Скопируйте ID таблицы в `backend/config.js`

## 🎯 Готово!

Ваше чат-приложение с ИИ-ассистентом готово к работе!

- ✅ Gemini AI интеграция
- ✅ Google Sheets логирование  
- ✅ Современный UI
- ✅ Мобильная адаптация
- ✅ Аналитика

---

**Подробная документация**: [START.md](START.md)
