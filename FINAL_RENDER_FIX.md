# 🚀 Финальное исправление деплоя на Render

## ✅ Проблема решена!

Репозиторий очищен от секретов и готов к деплою.

## 🔧 Инструкция по исправлению деплоя

### 1. **Откройте Render Dashboard**
Перейдите в [https://dashboard.render.com](https://dashboard.render.com)

### 2. **Обновите переменные окружения**

В вашем сервисе `ghhowai-2` обновите переменные:

#### **GEMINI_API_KEY**
```
your_gemini_api_key_here
```

#### **GOOGLE_SHEET_ID**
```
your_google_sheet_id_here
```

#### **GOOGLE_CREDENTIALS_JSON** (ВАЖНО!)
Скопируйте содержимое файла `probable-surge-471111-h5-64c2ce9d29cd.json` и замените все `\n` на `\\n`:

**Исходный формат:**
```json
{
  "type": "service_account",
  "project_id": "probable-surge-471111-h5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC15jKVKRT/1t5K\n..."
}
```

**Формат для Render (в одну строку с \\n):**
```json
{"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n","client_email":"YOUR_SERVICE_ACCOUNT_EMAIL","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/YOUR_SERVICE_ACCOUNT_EMAIL","universe_domain":"googleapis.com"}
```

### 3. **Перезапустите деплой**

1. Нажмите **Manual Deploy** → **Deploy latest commit**
2. Дождитесь завершения деплоя

## 🔍 Проверка

После успешного деплоя проверьте:

1. **Health check**: `https://ghhowai-2.onrender.com/api/health`
2. **Prompts API**: `https://ghhowai-2.onrender.com/api/prompts`
3. **Chat API**: `https://ghhowai-2.onrender.com/api/chat`

## ✅ Ожидаемый результат

```
✅ Google Sheets API инициализирован
🚀 Сервер запущен на порту 5002
📊 Доступные промпты: 4
```

## 🎯 Что включено в проект

### **Frontend:**
- `index.html` - основная страница чата
- `index-prompts.html` - страница с системой промптов
- `styles.css` - стили в стиле Альфа-Банка
- `script.js` - локальная версия
- `script-prompts.js` - версия с системой промптов

### **Backend:**
- `backend/server.js` - Express сервер с поддержкой промптов
- `backend/config.js` - конфигурация
- `backend/package.json` - зависимости

### **Система промптов:**
- `prompts/systemPrompts.js` - 4 готовых промпта
- `utils/promptManager.js` - управление промптами
- `utils/promptSecurity.js` - безопасность
- `utils/promptMonitoring.js` - мониторинг
- `components/PromptSelector.js` - UI компонент

### **Документация:**
- `PROMPTS_SYSTEM.md` - документация системы промптов
- `RENDER_DEPLOY_SAFE.md` - инструкции по деплою
- `README.md` - основная документация

## 🚀 Готово!

Проект полностью готов к использованию с системой системных промптов! 🎉
