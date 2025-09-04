# 🚀 Полное руководство по запуску чат-приложения

Это руководство поможет вам запустить полнофункциональное чат-приложение с ИИ-ассистентом, backend API и интеграцией с Google Sheets.

## 📁 Структура проекта

```
GHHOWAI/
├── frontend/                 # Фронтенд приложения
│   ├── index.html           # Главная страница
│   ├── styles.css           # Стили
│   ├── script.js            # Оригинальный скрипт (локальные ответы)
│   └── script-backend.js    # Скрипт с интеграцией backend
├── backend/                  # Backend API
│   ├── server.js            # Express сервер
│   ├── config.js            # Конфигурация
│   ├── package.json         # Зависимости
│   ├── test-api.js          # Тесты API
│   └── credentials/         # Google Service Account
└── START.md                 # Это руководство
```

## 🎯 Варианты запуска

### Вариант 1: Только фронтенд (локальные ответы)

**Быстрый старт без backend:**

1. Откройте `index.html` в браузере
2. Готово! Приложение работает с локальными ответами

### Вариант 2: Полная версия с backend и Gemini AI

**Полнофункциональная версия с реальным ИИ:**

## 🔧 Установка и настройка

### 1. Установка зависимостей backend

```bash
cd backend
npm install
```

### 2. Настройка Google Sheets

1. **Создайте Google Sheet** с колонками:
   - A: Дата и время
   - B: Номер вопроса  
   - C: Вопрос пользователя
   - D: Ответ ИИ

2. **Поделитесь таблицей** с email: `ghtest@probable-surge-471111-h5.iam.gserviceaccount.com`

3. **Скопируйте ID таблицы** из URL и вставьте в `config.js`

### 3. Настройка Gemini API

1. Получите API ключ в [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Добавьте ключ в `config.js` или создайте `.env` файл

### 4. Запуск backend

```bash
cd backend
npm start
```

Сервер запустится на `http://localhost:5002`

### 5. Настройка фронтенда

Замените `script.js` на `script-backend.js`:

```bash
cd ..
cp script-backend.js script.js
```

Или откройте `index.html` и замените строку:
```html
<script src="script.js"></script>
```
на:
```html
<script src="script-backend.js"></script>
```

### 6. Запуск фронтенда

Откройте `index.html` в браузере или запустите локальный сервер:

```bash
python3 -m http.server 8000
# Откройте http://localhost:8000
```

## 🧪 Тестирование

### Тест backend API

```bash
cd backend
node test-api.js
```

### Тест через браузер

1. Откройте `test.html` для тестирования функций
2. Откройте `demo.html` для просмотра всех состояний

### Ручное тестирование API

```bash
# Health check
curl http://localhost:5002/api/health

# Тест чата
curl -X POST http://localhost:5002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Привет!","promptcount":1}'
```

## 🔍 Проверка работы

### 1. Backend работает

- ✅ Сервер запущен на порту 5002
- ✅ Health check возвращает статус OK
- ✅ Google Sheets подключен
- ✅ Gemini API отвечает

### 2. Фронтенд работает

- ✅ Страница загружается
- ✅ Сообщения отправляются
- ✅ Ответы приходят от ИИ
- ✅ Логирование в Google Sheets

### 3. Интеграция работает

- ✅ Фронтенд подключается к backend
- ✅ Сообщения записываются в Google Sheets
- ✅ Время записывается в московском часовом поясе

## 🐛 Решение проблем

### Backend не запускается

```bash
# Проверьте зависимости
npm install

# Проверьте порт
lsof -i :5002

# Проверьте логи
npm start
```

### Gemini API не работает

1. Проверьте API ключ в `config.js`
2. Убедитесь в корректности ключа
3. Проверьте квоты в Google AI Studio

### Google Sheets не работает

1. Проверьте ID таблицы
2. Убедитесь, что таблица расшарена с Service Account
3. Проверьте права доступа

### Фронтенд не подключается к backend

1. Убедитесь, что backend запущен
2. Проверьте CORS настройки
3. Проверьте URL в `script-backend.js`

## 📊 Мониторинг

### Логи backend

```bash
# Просмотр логов в реальном времени
tail -f logs/app.log

# Или через PM2
pm2 logs chat-backend
```

### Проверка Google Sheets

1. Откройте вашу Google Sheet
2. Проверьте, что новые записи появляются
3. Убедитесь в корректности времени (Москва)

### Аналитика

- Google Analytics: события в консоли разработчика
- Yandex.Metrika: события в панели метрики

## 🚀 Деплой в продакшен

### 1. Настройка переменных окружения

```env
NODE_ENV=production
PORT=5002
GEMINI_API_KEY=your_production_key
GOOGLE_SHEET_ID=your_production_sheet
CORS_ORIGIN=https://yourdomain.com
```

### 2. Запуск с PM2

```bash
npm install -g pm2
pm2 start server.js --name "chat-backend"
pm2 save
pm2 startup
```

### 3. Настройка Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/frontend;
        index index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📈 Масштабирование

### Горизонтальное масштабирование

1. Запустите несколько экземпляров backend
2. Используйте load balancer (Nginx, HAProxy)
3. Настройте sticky sessions если нужно

### Вертикальное масштабирование

1. Увеличьте ресурсы сервера
2. Настройте мониторинг (Prometheus, Grafana)
3. Оптимизируйте запросы к Google Sheets

## 🔒 Безопасность

### Рекомендации

1. Используйте HTTPS в продакшене
2. Настройте rate limiting
3. Ограничьте CORS домены
4. Регулярно обновляйте зависимости
5. Мониторьте логи на подозрительную активность

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи backend и frontend
2. Убедитесь в корректности API ключей
3. Проверьте доступность внешних сервисов
4. Создайте issue в репозитории

---

**Удачного запуска! 🎉**
