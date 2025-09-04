import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { google } from 'googleapis';
import config from './config.js';
import { PromptManager } from '../utils/promptManager.js';
import { PromptSecurity } from '../utils/promptSecurity.js';
import { PromptMonitoring } from '../utils/promptMonitoring.js';

// Инициализация Express приложения
const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware для получения промпта
const getSystemPrompt = (req, res, next) => {
  const promptId = req.headers['x-prompt-id'] || 'JKU_ASSISTANT';
  const prompt = promptManager.setPrompt(promptId);
  
  if (!prompt) {
    return res.status(400).json({ 
      error: 'Неверный ID промпта',
      availablePrompts: promptManager.getAvailablePrompts()
    });
  }
  
  req.systemPrompt = promptManager.getCurrentPrompt();
  next();
};

// Логирование запросов
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Инициализация Google Sheets API
let sheets;
let auth;

// Инициализация системы промптов
const promptManager = new PromptManager();
const promptMonitoring = new PromptMonitoring();

async function initializeGoogleSheets() {
  try {
    auth = new google.auth.GoogleAuth({
      credentials: config.googleSheets.credentials,
      scopes: config.googleSheets.scopes
    });

    sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API инициализирован');
  } catch (error) {
    console.error('❌ Ошибка инициализации Google Sheets API:', error.message);
  }
}

// Функция для получения московского времени
function getMoscowTime() {
  const now = new Date();
  const moscowTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Moscow"}));
  return moscowTime.toISOString().replace('T', ' ').substring(0, 19);
}

// Функция для записи в Google Sheets
async function logToGoogleSheets(promptCount, question, answer) {
  if (!sheets) {
    console.warn('⚠️ Google Sheets не инициализирован, пропускаем логирование');
    return;
  }

  try {
    const timestamp = getMoscowTime();
    
    const values = [
      [timestamp, promptCount, question, answer]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.googleSheets.sheetId,
      range: 'A:D',
      valueInputOption: 'RAW',
      resource: {
        values: values
      }
    });

    console.log(`📊 Запись в Google Sheets: ${timestamp} - Вопрос ${promptCount}`);
  } catch (error) {
    console.error('❌ Ошибка записи в Google Sheets:', error.message);
    // Не прерываем работу приложения при ошибке записи
  }
}

// Функция для генерации ответа через Gemini API
async function generateGeminiResponse(message, systemPrompt) {
  try {
    const startTime = Date.now();
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `${systemPrompt.prompt}\n\nВопрос пользователя: ${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await axios.post(
      `${config.gemini.baseUrl}?key=${config.gemini.apiKey}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: config.gemini.timeout
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        const responseTime = Date.now() - startTime;
        const success = true;
        
        // Отслеживание использования промпта
        promptMonitoring.trackPromptUsage(systemPrompt.id, responseTime, success);
        
        return candidate.content.parts[0].text;
      }
    }

    throw new Error('Неожиданный формат ответа от Gemini API');
  } catch (error) {
    console.error('❌ Ошибка Gemini API:', error.message);
    
    if (error.response) {
      console.error('Статус ответа:', error.response.status);
      console.error('Данные ответа:', error.response.data);
    }
    
    // Отслеживание ошибки промпта
    const responseTime = Date.now() - startTime;
    const success = false;
    promptMonitoring.trackPromptUsage(systemPrompt.id, responseTime, success);
    
    throw error;
  }
}

// Валидация входящих данных
function validateRequest(body) {
  const errors = [];

  if (!body.message) {
    errors.push('Поле "message" обязательно');
  } else if (typeof body.message !== 'string') {
    errors.push('Поле "message" должно быть строкой');
  } else if (body.message.length < config.validation.minMessageLength) {
    errors.push(`Сообщение должно содержать минимум ${config.validation.minMessageLength} символ`);
  } else if (body.message.length > config.validation.maxMessageLength) {
    errors.push(`Сообщение не должно превышать ${config.validation.maxMessageLength} символов`);
  }

  if (body.promptcount !== undefined) {
    if (typeof body.promptcount !== 'number' || !Number.isInteger(body.promptcount)) {
      errors.push('Поле "promptcount" должно быть целым числом');
    } else if (body.promptcount < 1 || body.promptcount > config.validation.maxPromptCount) {
      errors.push(`Поле "promptcount" должно быть от 1 до ${config.validation.maxPromptCount}`);
    }
  }

  return errors;
}

// Endpoint для получения доступных промптов
app.get('/api/prompts', (req, res) => {
  res.json({
    current: promptManager.getCurrentPrompt(),
    available: promptManager.getAvailablePrompts(),
    history: promptManager.getPromptHistory()
  });
});

// Endpoint для смены промпта
app.post('/api/prompts/switch', (req, res) => {
  const { promptId } = req.body;
  const success = promptManager.setPrompt(promptId);
  
  if (success) {
    res.json({ 
      success: true, 
      currentPrompt: promptManager.getCurrentPrompt() 
    });
  } else {
    res.status(400).json({ 
      success: false, 
      error: 'Промпт не найден' 
    });
  }
});

// Endpoint для создания кастомного промпта
app.post('/api/prompts/custom', (req, res) => {
  const { id, name, description, prompt } = req.body;
  
  const validation = promptManager.validatePrompt(prompt);
  if (!validation.isValid) {
    return res.status(400).json({ 
      success: false, 
      errors: validation.issues 
    });
  }
  
  const customPrompt = promptManager.createCustomPrompt(id, name, description, prompt);
  res.json({ success: true, prompt: customPrompt });
});

// Endpoint для получения статистики промптов
app.get('/api/prompts/stats', (req, res) => {
  res.json({
    metrics: promptMonitoring.getAllMetrics(),
    currentPrompt: promptManager.getCurrentPrompt()
  });
});

// Основной endpoint для чата
app.post('/api/chat', getSystemPrompt, async (req, res) => {
  try {
    // Валидация запроса
    const validationErrors = validateRequest(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Ошибка валидации',
        details: validationErrors
      });
    }

    const { message, promptcount = 1 } = req.body;
    const systemPrompt = req.systemPrompt;
    
    console.log(`💬 Обработка сообщения #${promptcount} с промптом ${systemPrompt.id}: ${message.substring(0, 50)}...`);

    // Генерация ответа через Gemini с системным промптом
    const aiResponse = await generateGeminiResponse(message, systemPrompt);
    
    console.log(`🤖 Ответ сгенерирован: ${aiResponse.substring(0, 50)}...`);

    // Асинхронная запись в Google Sheets (не блокирует ответ)
    logToGoogleSheets(promptcount, message, aiResponse).catch(error => {
      console.error('Ошибка логирования (не критично):', error.message);
    });

    // Отправка ответа
    res.json({
      reply: aiResponse
    });

  } catch (error) {
    console.error('❌ Ошибка обработки запроса:', error.message);
    
    // Отправка fallback ответа при ошибке
    const fallbackResponse = 'Извините, произошла техническая ошибка. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.';
    
    res.status(500).json({
      reply: fallbackResponse,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      gemini: config.gemini.apiKey ? 'configured' : 'not_configured',
      googleSheets: sheets ? 'connected' : 'not_connected'
    }
  });
});

// Endpoint для тестирования Google Sheets
app.post('/api/test-sheets', async (req, res) => {
  try {
    if (!sheets) {
      return res.status(500).json({ error: 'Google Sheets не инициализирован' });
    }

    await logToGoogleSheets(999, 'Тестовое сообщение', 'Тестовый ответ');
    res.json({ message: 'Тестовая запись в Google Sheets успешна' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint не найден',
    availableEndpoints: [
      'POST /api/chat',
      'GET /api/health',
      'POST /api/test-sheets'
    ]
  });
});

// Глобальная обработка ошибок
app.use((error, req, res, next) => {
  console.error('❌ Необработанная ошибка:', error);
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Что-то пошло не так'
  });
});

// Запуск сервера
async function startServer() {
  try {
    // Инициализация Google Sheets
    await initializeGoogleSheets();
    
    // Запуск сервера
    const server = app.listen(config.port, () => {
      console.log('🚀 Сервер запущен!');
      console.log(`📍 Порт: ${config.port}`);
      console.log(`🌐 URL: http://localhost:${config.port}`);
      console.log(`💬 Chat API: http://localhost:${config.port}/api/chat`);
      console.log(`❤️ Health Check: http://localhost:${config.port}/api/health`);
      console.log('─'.repeat(50));
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Получен SIGTERM, завершение работы...');
      server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 Получен SIGINT, завершение работы...');
      server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанное отклонение промиса:', reason);
  process.exit(1);
});

// Запуск приложения
startServer();
