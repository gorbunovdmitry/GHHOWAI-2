// Конфигурация приложения
import dotenv from 'dotenv';
dotenv.config();

const config = {
  // Порт сервера (Render использует переменную PORT)
  port: process.env.PORT || 5002,
  
  // Gemini API
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    timeout: 30000
  },
  
  // Google Sheets
  googleSheets: {
    sheetId: process.env.GOOGLE_SHEET_ID || 'YOUR_GOOGLE_SHEET_ID_HERE',
    credentials: process.env.GOOGLE_CREDENTIALS_JSON ? 
      JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON) : 
      null, // Будет загружен из переменной окружения
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    timeout: 10000
  },
  
  // CORS настройки
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // Логирование
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: true,
    enableFile: false
  },
  
  // Валидация
  validation: {
    maxMessageLength: 1000,
    minMessageLength: 1,
    maxPromptCount: 1000
  }
};

export default config;
