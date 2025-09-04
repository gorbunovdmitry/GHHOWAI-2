# 🔧 Исправление деплоя на Render

## ❌ Проблема
Ошибка `SyntaxError: Unterminated string in JSON at position 892` при деплое на Render.

**Причина:** Неправильное экранирование символов `\n` в переменной окружения `GOOGLE_CREDENTIALS_JSON`.

## ✅ Решение

### 1. **Скопируйте правильный JSON**

Скопируйте содержимое файла `GOOGLE_CREDENTIALS_FOR_RENDER.txt` - это JSON с правильно экранированными символами `\\n`.

### 2. **Обновите переменные окружения в Render**

1. Откройте [Render Dashboard](https://dashboard.render.com)
2. Перейдите в ваш сервис `ghhowai-2`
3. Нажмите **Environment**
4. Обновите переменную `GOOGLE_CREDENTIALS_JSON`:

```
GOOGLE_CREDENTIALS_JSON={"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n","client_email":"YOUR_SERVICE_ACCOUNT_EMAIL","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/YOUR_SERVICE_ACCOUNT_EMAIL","universe_domain":"googleapis.com"}
```

### 3. **Добавьте остальные переменные**

Убедитесь, что у вас есть все необходимые переменные:

```
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}
```

### 4. **Перезапустите деплой**

1. Нажмите **Manual Deploy** → **Deploy latest commit**
2. Дождитесь завершения деплоя

## 🔍 Проверка

После успешного деплоя проверьте:

1. **Health check**: `https://ghhowai-2.onrender.com/api/health`
2. **Prompts API**: `https://ghhowai-2.onrender.com/api/prompts`
3. **Chat API**: `https://ghhowai-2.onrender.com/api/chat`

## 🚨 Альтернативное решение

Если проблема сохраняется, можно использовать файл credentials вместо переменной окружения:

1. Загрузите файл `probable-surge-471111-h5-64c2ce9d29cd.json` в корень проекта
2. Обновите `config.js`:

```javascript
googleSheets: {
  sheetId: process.env.GOOGLE_SHEET_ID || 'YOUR_GOOGLE_SHEET_ID_HERE',
  credentials: process.env.GOOGLE_CREDENTIALS_JSON ? 
    JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON) : 
    require('./probable-surge-471111-h5-64c2ce9d29cd.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  timeout: 10000
}
```

## ✅ Ожидаемый результат

После исправления деплой должен пройти успешно, и вы увидите:

```
✅ Google Sheets API инициализирован
🚀 Сервер запущен на порту 5002
📊 Доступные промпты: 4
```

**URL сервиса:** `https://ghhowai-2.onrender.com`
