# Backend для чат-приложения с Gemini AI и Google Sheets

Полнофункциональный backend сервер для чат-приложения с интеграцией Google Gemini AI и автоматическим логированием диалогов в Google Sheets.

## 🚀 Особенности

- **Express.js** сервер с CORS поддержкой
- **Google Gemini AI** для генерации ответов ИИ
- **Google Sheets API** для автоматического логирования
- **Валидация** входящих данных
- **Обработка ошибок** с fallback ответами
- **Московское время** для логирования
- **Graceful shutdown** для корректного завершения

## 📁 Структура проекта

```
backend/
├── server.js          # Основной файл сервера
├── config.js          # Конфигурация приложения
├── package.json       # Зависимости и скрипты
├── .gitignore         # Игнорируемые файлы
├── credentials/       # Google Service Account ключи
│   └── probable-surge-471111-h5-c703c8d80db7.json
└── README.md          # Документация
```

## 🛠 Установка и запуск

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в папке `backend/`:

```env
# Порт сервера
PORT=5002

# Gemini API ключ
GEMINI_API_KEY=your_gemini_api_key_here

# Google Sheets ID
GOOGLE_SHEET_ID=your_google_sheet_id_here

# Google Service Account Credentials (JSON строка)
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}

# Настройки CORS
CORS_ORIGIN=*

# Настройки логирования
LOG_LEVEL=info
```

### 3. Запуск сервера

```bash
# Продакшен режим
npm start

# Режим разработки (с автоперезагрузкой)
npm run dev
```

## 🔧 API Endpoints

### POST /api/chat

Основной endpoint для отправки сообщений в чат.

**Запрос:**
```json
{
  "message": "Как работает кэшбэк?",
  "promptcount": 1
}
```

**Ответ:**
```json
{
  "reply": "Кэшбэк начисляется автоматически при покупках у партнеров..."
}
```

### GET /api/health

Проверка состояния сервера и подключенных сервисов.

**Ответ:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "services": {
    "gemini": "configured",
    "googleSheets": "connected"
  }
}
```

### POST /api/test-sheets

Тестирование записи в Google Sheets.

**Ответ:**
```json
{
  "message": "Тестовая запись в Google Sheets успешна"
}
```

## 🤖 Интеграция с Gemini AI

### Настройка

1. Получите API ключ в [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Добавьте ключ в переменную `GEMINI_API_KEY`

### Конфигурация

- **Модель**: gemini-2.0-flash
- **Температура**: 0.7
- **Максимальная длина ответа**: 1024 токена
- **Таймаут**: 30 секунд

### Безопасность

Настроены фильтры безопасности для блокировки:
- Harassment (средний и выше уровень)
- Hate Speech (средний и выше уровень)
- Sexually Explicit (средний и выше уровень)
- Dangerous Content (средний и выше уровень)

## 📊 Интеграция с Google Sheets

### Настройка

1. Создайте Google Sheet с колонками:
   - A: Дата и время (Москва)
   - B: Номер вопроса
   - C: Вопрос пользователя
   - D: Ответ ИИ

2. Создайте Service Account в Google Cloud Console
3. Поделитесь таблицей с email Service Account
4. Добавьте credentials в `.env` или папку `credentials/`

### Автоматическое логирование

Все диалоги автоматически записываются в Google Sheets:
- **Время**: Московское время в формате "YYYY-MM-DD HH:MM:SS"
- **Асинхронно**: Не блокирует ответ пользователю
- **Обработка ошибок**: Продолжает работу при недоступности Sheets

## 🛡 Безопасность и валидация

### Валидация запросов

- Проверка наличия поля `message`
- Валидация длины сообщения (1-1000 символов)
- Проверка типа данных
- Валидация `promptcount` (1-1000)

### CORS настройки

- Поддержка всех доменов (`*`)
- Разрешенные методы: GET, POST, OPTIONS
- Разрешенные заголовки: Content-Type, Authorization

### Обработка ошибок

- **400**: Ошибки валидации
- **500**: Внутренние ошибки сервера
- **Fallback ответы**: При недоступности Gemini API
- **Логирование**: Все ошибки записываются в консоль

## 📝 Логирование

### Уровни логирования

- **info**: Обычные операции
- **warn**: Предупреждения
- **error**: Ошибки

### Что логируется

- HTTP запросы с IP и временными метками
- Операции с Gemini API
- Записи в Google Sheets
- Ошибки и исключения

## 🔄 Производительность

### Оптимизации

- **Кэширование** Google Sheets клиента
- **Асинхронная** запись в таблицы
- **Таймауты** для всех внешних запросов
- **Graceful degradation** при недоступности сервисов

### Мониторинг

- Health check endpoint
- Статистика uptime
- Статус подключенных сервисов

## 🚀 Деплой

### Переменные окружения для продакшена

```env
NODE_ENV=production
PORT=5002
GEMINI_API_KEY=your_production_key
GOOGLE_SHEET_ID=your_production_sheet
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

### PM2 (рекомендуется)

```bash
npm install -g pm2
pm2 start server.js --name "chat-backend"
pm2 save
pm2 startup
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5002
CMD ["npm", "start"]
```

## 🐛 Отладка

### Логи

```bash
# Просмотр логов в реальном времени
tail -f logs/app.log

# Логи PM2
pm2 logs chat-backend
```

### Тестирование

```bash
# Health check
curl http://localhost:5002/api/health

# Тест чата
curl -X POST http://localhost:5002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Привет!","promptcount":1}'

# Тест Google Sheets
curl -X POST http://localhost:5002/api/test-sheets
```

## 📊 Мониторинг

### Метрики

- Количество запросов в минуту
- Время ответа Gemini API
- Успешность записи в Google Sheets
- Ошибки и исключения

### Алерты

Настройте мониторинг для:
- Высокого времени ответа (>5 сек)
- Ошибок Gemini API
- Недоступности Google Sheets
- Высокой нагрузки на сервер

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи сервера
2. Убедитесь в корректности API ключей
3. Проверьте доступность Google Sheets
4. Протестируйте через health check endpoint

## 📄 Лицензия

MIT License - используйте свободно для коммерческих и некоммерческих проектов.

---

**Создано с ❤️ для Альфа-Банка**
