# 🚀 Деплой на Render.com - Чистая версия

## 📋 Инструкция по развертыванию

### 1. Подготовка репозитория

1. **Создайте Git репозиторий** (GitHub, GitLab, Bitbucket)
2. **Загрузите код** в репозиторий:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ghhowai-backend.git
   git push -u origin main
   ```

### 2. Создание сервиса на Render

1. **Войдите в Render Dashboard**: https://dashboard.render.com
2. **Нажмите "New +"** → **"Web Service"**
3. **Подключите репозиторий** с вашим кодом
4. **Настройте сервис**:

**Основные настройки:**
- **Name**: `ghhowai-backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

**Переменные окружения:**
```env
NODE_ENV=production
PORT=10000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GOOGLE_SHEET_ID=YOUR_GOOGLE_SHEET_ID_HERE
GOOGLE_CREDENTIALS_JSON=YOUR_GOOGLE_CREDENTIALS_JSON_HERE
CORS_ORIGIN=*
LOG_LEVEL=info
```

### 3. Деплой

1. **Нажмите "Create Web Service"**
2. **Дождитесь сборки** (5-10 минут)
3. **Проверьте логи** на наличие ошибок

### 4. Тестирование

После успешного деплоя протестируйте:

```bash
# Health check
curl https://ghhowai-2.onrender.com/api/health

# Тест чата
curl -X POST https://ghhowai-2.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Привет! Тест Render","promptcount":1}'

# Тест Google Sheets
curl -X POST https://ghhowai-2.onrender.com/api/test-sheets
```

### 5. Обновление фронтенда

Замените `script.js` на `script-render.js`:

```bash
# В корневой папке проекта
cp script-render.js script.js
```

Или обновите HTML:
```html
<script src="script-render.js"></script>
```

## 🔧 Альтернативный способ через CLI

Если у вас установлен Render CLI:

```bash
# Установка CLI
npm install -g @render/cli

# Авторизация
render auth login

# Создание сервиса
render services create web \
  --name "ghhowai-backend" \
  --runtime "node" \
  --build-command "npm install" \
  --start-command "npm start" \
  --plan "free"
```

## 📊 Мониторинг

### Логи
- **Build Logs**: Ошибки сборки
- **Runtime Logs**: Ошибки выполнения
- **Metrics**: CPU, Memory, Response Time

### Алерты
Настройте уведомления о:
- Недоступности сервиса
- Высоком времени ответа
- Ошибках в логах

## 🚀 Автоматический деплой

При каждом push в main ветку:
1. Render автоматически соберет новый образ
2. Остановит старый сервис
3. Запустит новый сервис
4. Проверит health check

## 💰 Стоимость

- **Free план**: До 750 часов в месяц
- **Starter план**: $7/месяц за всегда работающий сервис
- **Professional план**: $25/месяц с дополнительными возможностями

## 🔍 Troubleshooting

### Проблемы с деплоем

1. **Build failed**: Проверьте логи сборки
2. **Service crashed**: Проверьте переменные окружения
3. **Timeout**: Увеличьте timeout в настройках

### Проблемы с API

1. **CORS errors**: Проверьте CORS_ORIGIN
2. **Google Sheets errors**: Проверьте GOOGLE_CREDENTIALS_JSON
3. **Gemini API errors**: Проверьте GEMINI_API_KEY

## ✅ Готово!

После успешного деплоя ваш backend будет доступен по адресу:
**https://ghhowai-2.onrender.com**

Фронтенд будет автоматически подключаться к Render backend и показывать статус подключения в правом верхнем углу.

---

**Удачного деплоя! 🎉**
