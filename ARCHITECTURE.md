# 🏗️ Архитектура чат-приложения

## Схема системы

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Browser)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   index.html │  │  styles.css │  │ script.js   │            │
│  │             │  │             │  │             │            │
│  │  - HTML     │  │  - CSS      │  │  - JS       │            │
│  │  - UI       │  │  - Styling  │  │  - Logic    │            │
│  │  - Layout   │  │  - Mobile   │  │  - API      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS
                                │ JSON API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  server.js  │  │  config.js  │  │  Express    │            │
│  │             │  │             │  │             │            │
│  │  - Routes   │  │  - Settings │  │  - CORS     │            │
│  │  - Logic    │  │  - API Keys │  │  - Middleware│           │
│  │  - Errors   │  │  - Timeouts │  │  - Security │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  GEMINI AI API  │ │ GOOGLE SHEETS   │ │   ANALYTICS     │
│                 │ │                 │ │                 │
│  - Chat GPT     │ │  - Logging      │ │  - Google       │
│  - Responses    │ │  - Storage      │ │  - Yandex       │
│  - Safety       │ │  - Moscow Time  │ │  - Events       │
│  - Context      │ │  - Async        │ │  - Tracking     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 🔄 Поток данных

### 1. Пользователь отправляет сообщение
```
User Input → Frontend → Validation → Backend API
```

### 2. Обработка в backend
```
Backend → Gemini API → AI Response → Google Sheets (async)
```

### 3. Ответ пользователю
```
Backend → Frontend → UI Update → User sees response
```

## 📊 Компоненты системы

### Frontend
- **HTML**: Структура интерфейса
- **CSS**: Стилизация и адаптивность
- **JavaScript**: Логика и API интеграция

### Backend
- **Express.js**: HTTP сервер
- **CORS**: Безопасность запросов
- **Validation**: Проверка данных
- **Error Handling**: Обработка ошибок

### Внешние сервисы
- **Gemini AI**: Генерация ответов ИИ
- **Google Sheets**: Логирование диалогов
- **Analytics**: Отслеживание событий

## 🔧 Технические детали

### API Endpoints
```
POST /api/chat          - Основной чат
GET  /api/health        - Проверка состояния
POST /api/test-sheets   - Тест Google Sheets
```

### Конфигурация
```javascript
{
  port: 5002,
  gemini: { apiKey, baseUrl, timeout },
  googleSheets: { sheetId, credentials, scopes },
  cors: { origin, methods, headers }
}
```

### Безопасность
- CORS настройки
- Валидация входных данных
- Таймауты запросов
- Обработка ошибок
- Rate limiting (опционально)

## 📱 Мобильная адаптация

### Responsive Design
- Viewport meta tag
- Flexible layouts
- Touch-friendly elements
- Safe area insets

### Performance
- Lazy loading
- Image optimization
- Minified assets
- Caching strategies

## 🚀 Масштабирование

### Горизонтальное
- Load balancer
- Multiple instances
- Session management
- Database clustering

### Вертикальное
- Resource optimization
- Caching layers
- CDN integration
- Monitoring tools

## 🔍 Мониторинг

### Логирование
- Request/Response logs
- Error tracking
- Performance metrics
- User analytics

### Алерты
- Service availability
- Response times
- Error rates
- Resource usage

---

**Система готова к продакшену! 🎉**
