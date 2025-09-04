# 🤖 Система системных промптов

Гибкая система управления поведением ИИ-ассистента с возможностью настройки, версионирования и динамического управления.

## 🎯 Основные возможности

### ✅ **Управление промптами**
- **4 готовых промпта**: ИИ-ассистент Альфа-Банка, Техническая поддержка, Общий помощник, Ассистент по лояльности
- **Динамическая смена** промптов без перезагрузки
- **Кастомные промпты** с валидацией
- **Версионирование** и история изменений

### ✅ **Безопасность**
- **Валидация промптов** на запрещенные слова и инъекции
- **Проверка безопасности** на утечку данных
- **Защита от обхода** системы

### ✅ **Мониторинг и аналитика**
- **Статистика использования** каждого промпта
- **Время ответа** и успешность
- **История смены** промптов
- **Аналитика эффективности**

## 📁 Структура файлов

```
prompts/
├── systemPrompts.js          # Определения всех промптов
utils/
├── promptManager.js          # Управление промптами
├── promptSecurity.js         # Безопасность промптов
└── promptMonitoring.js       # Мониторинг и аналитика
components/
└── PromptSelector.js         # UI компонент выбора промптов
```

## 🚀 Быстрый старт

### 1. Запуск с системой промптов

```bash
# Запуск backend
cd backend
npm install
npm start

# Откройте index-prompts.html в браузере
open index-prompts.html
```

### 2. API Endpoints

```javascript
// Получить доступные промпты
GET /api/prompts

// Сменить промпт
POST /api/prompts/switch
{
  "promptId": "jku_assistant"
}

// Создать кастомный промпт
POST /api/prompts/custom
{
  "id": "custom_prompt",
  "name": "Мой промпт",
  "description": "Описание",
  "prompt": "Текст промпта..."
}

// Получить статистику
GET /api/prompts/stats
```

## 🎨 Использование во фронтенде

### Инициализация селектора промптов

```javascript
// Создание контейнера
const promptContainer = document.createElement('div');
promptContainer.id = 'promptSelectorContainer';
document.body.appendChild(promptContainer);

// Инициализация
const promptSelector = new PromptSelector('promptSelectorContainer', (promptId, prompt) => {
  console.log('Промпт изменен:', promptId, prompt);
  // Ваша логика обработки смены промпта
});
```

### Отправка запросов с промптом

```javascript
// Заголовок с ID промпта
const headers = {
  'Content-Type': 'application/json',
  'X-Prompt-ID': 'jku_assistant' // ID выбранного промпта
};

fetch('/api/chat', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify({ message: 'Ваш вопрос' })
});
```

## 🔧 Настройка промптов

### Добавление нового промпта

```javascript
// В prompts/systemPrompts.js
export const SYSTEM_PROMPTS = {
  // ... существующие промпты
  
  MY_NEW_PROMPT: {
    id: 'my_new_prompt',
    version: '1.0.0',
    name: 'Мой новый промпт',
    description: 'Описание нового промпта',
    prompt: `Ты - специалист по...
    
    Твоя задача:
    - Помогать с...
    - Отвечать на...
    
    Ограничения:
    - Не давай...
    - Соблюдай...`
  }
};
```

### Создание кастомного промпта через API

```javascript
const customPrompt = {
  id: 'custom_support',
  name: 'Поддержка клиентов',
  description: 'Помощь клиентам с вопросами',
  prompt: 'Ты - специалист поддержки клиентов...'
};

fetch('/api/prompts/custom', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(customPrompt)
});
```

## 📊 Мониторинг и аналитика

### Статистика промптов

```javascript
// Получение статистики
fetch('/api/prompts/stats')
  .then(response => response.json())
  .then(data => {
    console.log('Метрики:', data.metrics);
    console.log('Текущий промпт:', data.currentPrompt);
  });
```

### Отслеживание событий

```javascript
// В PromptSelector.js автоматически отслеживаются:
// - prompt_changed - смена промпта
// - prompt_effectiveness - эффективность промпта
// - prompt_usage - использование промпта

// Google Analytics
gtag('event', 'prompt_changed', {
  new_prompt_id: 'jku_assistant',
  previous_prompt_id: 'tech_support'
});

// Yandex.Metrika
ym(12345678, 'reachGoal', 'prompt_changed', {
  prompt_id: 'jku_assistant'
});
```

## 🔒 Безопасность

### Валидация промптов

```javascript
import { PromptSecurity } from './utils/promptSecurity.js';

const validation = PromptSecurity.validatePrompt(promptText);
if (!validation.isValid) {
  console.error('Ошибки валидации:', validation.issues);
}
```

### Проверки безопасности

- **Запрещенные слова**: `ignore previous instructions`, `forget everything`
- **Инъекции промптов**: `system:`, `assistant:`, `<script>`
- **Утечка данных**: `password`, `secret`, `api key`
- **Обход системы**: `override`, `bypass`, `hack`

## 🎯 Готовые промпты

### 1. **JKU_ASSISTANT** - ИИ-ассистент Альфа-Банка
- Помощь по личным финансам
- Управление бюджетом и расходами
- Категоризация трат и цели

### 2. **TECH_SUPPORT** - Техническая поддержка
- Решение технических проблем
- Пошаговые инструкции
- Направление к специалистам

### 3. **GENERAL_ASSISTANT** - Общий помощник
- Универсальный ассистент
- Этичные ответы
- Уважение конфиденциальности

### 4. **LOYALTY_ASSISTANT** - Ассистент по лояльности
- Кэшбэк и баллы
- Партнерские предложения
- Система лояльности

## 📱 Адаптивность

### Мобильные устройства
- Селектор промптов адаптируется под экран
- Скрытие при открытой клавиатуре
- Удобное управление на сенсорных экранах

### Темная тема
- Автоматическое переключение
- Поддержка `prefers-color-scheme`
- Консистентный дизайн

## 🚀 Деплой

### Render
```yaml
# render.yaml
services:
  - type: web
    name: chat-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: GOOGLE_SHEET_ID
        sync: false
      - key: GOOGLE_CREDENTIALS_JSON
        sync: false
```

### Переменные окружения
```bash
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}
```

## 🔧 Разработка

### Добавление новых проверок безопасности

```javascript
// В utils/promptSecurity.js
static checkCustomSecurity(prompt) {
  const customPatterns = [
    /your_custom_pattern/i
  ];
  
  const issues = customPatterns.filter(pattern => 
    pattern.test(prompt)
  );
  
  return {
    hasIssues: issues.length > 0,
    issues: issues.map(() => 'Обнаружена кастомная угроза')
  };
}
```

### Расширение мониторинга

```javascript
// В utils/promptMonitoring.js
trackCustomMetric(promptId, metricName, value) {
  const key = `prompt_${promptId}_${metricName}`;
  // Ваша логика отслеживания
}
```

## 📈 Производительность

### Кэширование промптов
- Промпты загружаются один раз при старте
- Быстрое переключение между режимами
- Минимальная нагрузка на память

### Оптимизация запросов
- Параллельная загрузка статистики
- Ленивая загрузка истории
- Дебаунсинг для частых переключений

## 🎉 Результат

Полноценная система управления промптами с:
- ✅ **4 готовых промпта** для разных задач
- ✅ **Динамическое переключение** без перезагрузки
- ✅ **Безопасность и валидация** промптов
- ✅ **Мониторинг и аналитика** использования
- ✅ **Адаптивный UI** для всех устройств
- ✅ **API для интеграции** с другими системами

Система готова к продакшену и легко расширяется! 🚀
