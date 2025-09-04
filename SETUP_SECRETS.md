# 🔐 Настройка секретов для деплоя

## 📋 Необходимые секреты

Для работы приложения нужно настроить следующие переменные окружения:

### 1. Gemini API Key

1. **Получите API ключ**: https://makersuite.google.com/app/apikey
2. **Добавьте в Render**: `GEMINI_API_KEY=ваш_ключ_здесь`

### 2. Google Sheets ID

1. **Создайте Google Sheet** с колонками A, B, C, D
2. **Скопируйте ID** из URL: `https://docs.google.com/spreadsheets/d/ID_ЗДЕСЬ/edit`
3. **Добавьте в Render**: `GOOGLE_SHEET_ID=ваш_id_здесь`

### 3. Google Service Account Credentials

1. **Создайте Service Account** в Google Cloud Console
2. **Скачайте JSON ключ**
3. **Поделитесь таблицей** с email Service Account
4. **Конвертируйте JSON в одну строку**:

```bash
# Способ 1: Через jq
cat your-credentials.json | jq -c .

# Способ 2: Через sed
cat your-credentials.json | sed ':a;N;$!ba;s/\n/\\n/g' | sed 's/"/\\"/g'
```

5. **Добавьте в Render**: `GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}`

## 🚀 Настройка в Render

1. **Откройте ваш сервис** в Render Dashboard
2. **Перейдите в Environment**
3. **Добавьте переменные**:

```
NODE_ENV=production
PORT=10000
GEMINI_API_KEY=ваш_gemini_ключ
GOOGLE_SHEET_ID=ваш_sheet_id
GOOGLE_CREDENTIALS_JSON=ваш_json_credentials
CORS_ORIGIN=*
LOG_LEVEL=info
```

4. **Сохраните и перезапустите** сервис

## ✅ Проверка

После настройки проверьте:

```bash
# Health check
curl https://ghhowai-2.onrender.com/api/health

# Тест чата
curl -X POST https://ghhowai-2.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Тест","promptcount":1}'
```

## 🔒 Безопасность

- ✅ Никогда не коммитьте секреты в Git
- ✅ Используйте переменные окружения
- ✅ Регулярно ротируйте ключи
- ✅ Ограничьте права Service Account

---

**После настройки секретов ваше приложение будет полностью функциональным! 🎉**
