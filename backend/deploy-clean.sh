#!/bin/bash

# Скрипт для быстрого деплоя на Render (чистая версия)
echo "🚀 Деплой backend на Render..."

# Проверяем наличие Render CLI
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI не установлен. Установите: npm install -g @render/cli"
    exit 1
fi

# Проверяем авторизацию
if ! render auth whoami &> /dev/null; then
    echo "❌ Не авторизованы в Render CLI. Выполните: render auth login"
    exit 1
fi

# Создаем сервис
echo "📦 Создание сервиса..."
render services create web \
  --name "ghhowai-backend" \
  --runtime "node" \
  --build-command "npm install" \
  --start-command "npm start" \
  --plan "free" \
  --region "oregon" \
  --branch "main"

# Устанавливаем переменные окружения
echo "🔧 Настройка переменных окружения..."
render services env-vars set \
  --service "ghhowai-backend" \
  --key "NODE_ENV" \
  --value "production"

render services env-vars set \
  --service "ghhowai-backend" \
  --key "PORT" \
  --value "10000"

render services env-vars set \
  --service "ghhowai-backend" \
  --key "GEMINI_API_KEY" \
  --value "YOUR_GEMINI_API_KEY_HERE"

render services env-vars set \
  --service "ghhowai-backend" \
  --key "GOOGLE_SHEET_ID" \
  --value "YOUR_GOOGLE_SHEET_ID_HERE"

render services env-vars set \
  --service "ghhowai-backend" \
  --key "GOOGLE_CREDENTIALS_JSON" \
  --value "YOUR_GOOGLE_CREDENTIALS_JSON_HERE"

render services env-vars set \
  --service "ghhowai-backend" \
  --key "CORS_ORIGIN" \
  --value "*"

render services env-vars set \
  --service "ghhowai-backend" \
  --key "LOG_LEVEL" \
  --value "info"

echo "✅ Сервис создан и настроен!"
echo "🌐 URL: https://ghhowai-2.onrender.com"
echo "📊 Dashboard: https://dashboard.render.com"
echo ""
echo "🧪 Тестирование:"
echo "curl https://ghhowai-2.onrender.com/api/health"
echo ""
echo "⚠️ Не забудьте заменить placeholder значения на реальные!"
