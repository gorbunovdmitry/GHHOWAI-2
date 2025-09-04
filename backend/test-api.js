const axios = require('axios');

// Конфигурация для тестирования
const API_BASE_URL = 'http://localhost:5002';
const TEST_MESSAGES = [
  'Привет! Как дела?',
  'Расскажи про кэшбэк',
  'Какие партнеры участвуют в программе лояльности?',
  'Как накопить баллы?',
  '**Жирный текст** и *курсив* - тест форматирования'
];

// Функция для тестирования health check
async function testHealthCheck() {
  try {
    console.log('🔍 Тестирование health check...');
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Health check успешен:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Функция для тестирования чата
async function testChat(message, promptCount = 1) {
  try {
    console.log(`💬 Тестирование чата (сообщение ${promptCount}): ${message.substring(0, 50)}...`);
    
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      message: message,
      promptcount: promptCount
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log(`✅ Ответ получен: ${response.data.reply.substring(0, 100)}...`);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка чата:', error.response?.data || error.message);
    return null;
  }
}

// Функция для тестирования Google Sheets
async function testGoogleSheets() {
  try {
    console.log('📊 Тестирование Google Sheets...');
    const response = await axios.post(`${API_BASE_URL}/api/test-sheets`);
    console.log('✅ Google Sheets тест успешен:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Google Sheets тест failed:', error.response?.data || error.message);
    return false;
  }
}

// Функция для тестирования валидации
async function testValidation() {
  console.log('🛡️ Тестирование валидации...');
  
  const invalidRequests = [
    { data: {}, expected: 'Отсутствует message' },
    { data: { message: '' }, expected: 'Пустое сообщение' },
    { data: { message: 'a'.repeat(1001) }, expected: 'Слишком длинное сообщение' },
    { data: { message: 'test', promptcount: 'invalid' }, expected: 'Неверный promptcount' },
    { data: { message: 'test', promptcount: -1 }, expected: 'Отрицательный promptcount' }
  ];

  for (const test of invalidRequests) {
    try {
      await axios.post(`${API_BASE_URL}/api/chat`, test.data);
      console.log(`❌ Валидация не сработала для: ${test.expected}`);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`✅ Валидация сработала для: ${test.expected}`);
      } else {
        console.log(`❌ Неожиданная ошибка для: ${test.expected} - ${error.message}`);
      }
    }
  }
}

// Функция для тестирования производительности
async function testPerformance() {
  console.log('⚡ Тестирование производительности...');
  
  const startTime = Date.now();
  const promises = [];
  
  // Отправляем 5 параллельных запросов
  for (let i = 0; i < 5; i++) {
    promises.push(testChat(`Тест производительности ${i + 1}`, i + 1));
  }
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const successCount = results.filter(r => r !== null).length;
  
  console.log(`📊 Результаты производительности:`);
  console.log(`   - Время выполнения: ${duration}ms`);
  console.log(`   - Успешных запросов: ${successCount}/5`);
  console.log(`   - Среднее время на запрос: ${Math.round(duration / 5)}ms`);
}

// Основная функция тестирования
async function runTests() {
  console.log('🚀 Запуск тестов API...\n');
  
  // 1. Health check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('❌ Сервер недоступен, завершение тестов');
    return;
  }
  
  console.log('');
  
  // 2. Тест Google Sheets
  await testGoogleSheets();
  console.log('');
  
  // 3. Тест валидации
  await testValidation();
  console.log('');
  
  // 4. Тест чата
  console.log('💬 Тестирование чата...');
  for (let i = 0; i < TEST_MESSAGES.length; i++) {
    await testChat(TEST_MESSAGES[i], i + 1);
    // Небольшая пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('');
  
  // 5. Тест производительности
  await testPerformance();
  console.log('');
  
  console.log('✅ Все тесты завершены!');
}

// Обработка ошибок
process.on('uncaughtException', (error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Необработанное отклонение промиса:', reason);
  process.exit(1);
});

// Запуск тестов
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Ошибка выполнения тестов:', error);
    process.exit(1);
  });
}

module.exports = {
  testHealthCheck,
  testChat,
  testGoogleSheets,
  testValidation,
  testPerformance,
  runTests
};
