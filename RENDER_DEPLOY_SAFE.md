# 🚀 Безопасный деплой на Render

## ❌ Проблема
Ошибка `SyntaxError: Unterminated string in JSON at position 892` при деплое на Render.

**Причина:** Неправильное экранирование символов `\n` в переменной окружения `GOOGLE_CREDENTIALS_JSON`.

## ✅ Решение

### 1. **Подготовьте JSON для Render**

Скопируйте ваш JSON файл `probable-surge-471111-h5-64c2ce9d29cd.json` и замените все `\n` на `\\n`:

**Исходный формат:**
```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC15jKVKRT/1t5K\n..."
}
```

**Формат для Render:**
```json
{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC15jKVKRT/1t5K\\n..."}
```

### 2. **Обновите переменные окружения в Render**

1. Откройте [Render Dashboard](https://dashboard.render.com)
2. Перейдите в ваш сервис `ghhowai-2`
3. Нажмите **Environment**
4. Обновите переменную `GOOGLE_CREDENTIALS_JSON` с правильно экранированным JSON

### 3. **Добавьте остальные переменные**

```
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CREDENTIALS_JSON={"type":"service_account","project_id":"probable-surge-471111-h5",...}
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

## 🔧 Быстрое исправление

1. Откройте файл `probable-surge-471111-h5-64c2ce9d29cd.json`
2. Скопируйте весь JSON в одну строку
3. Замените все `\n` на `\\n`
4. Вставьте в переменную `GOOGLE_CREDENTIALS_JSON` в Render
5. Перезапустите деплой
