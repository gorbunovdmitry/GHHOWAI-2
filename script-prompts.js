// Обновленный JavaScript с поддержкой системных промптов
// Замените содержимое script.js на этот код для интеграции с системой промптов

// Конфигурация приложения
const CONFIG = {
    MAX_MESSAGES: 50, // Лимит сообщений в сессии
    TYPING_DELAY: 1000, // Задержка перед показом "печатает"
    RESPONSE_DELAY: 1500, // Задержка ответа ИИ
    MESSAGE_LIMIT: 1000, // Максимальная длина сообщения
    API_BASE_URL: 'http://localhost:5002', // URL backend сервера
    REQUEST_TIMEOUT: 30000 // Таймаут запросов в мс
};

// Состояние приложения
let messageCount = 0;
let isTyping = false;
let isLimitReached = false;
let currentPrompt = null;
let promptSelector = null;

// DOM элементы
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const limitPage = document.getElementById('limitPage');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    addWelcomeMessage();
    checkBackendHealth();
    initializePromptSelector();
    
    // Аналитика
    trackEvent('page_view');
});

// Инициализация селектора промптов
function initializePromptSelector() {
    // Создаем контейнер для селектора промптов
    const promptContainer = document.createElement('div');
    promptContainer.id = 'promptSelectorContainer';
    promptContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        right: 10px;
        z-index: 1000;
        max-width: 400px;
        margin: 0 auto;
    `;
    
    // Вставляем контейнер в начало body
    document.body.insertBefore(promptContainer, document.body.firstChild);
    
    // Инициализируем селектор промптов
    promptSelector = new PromptSelector('promptSelectorContainer', handlePromptChange);
}

// Обработка смены промпта
function handlePromptChange(promptId, prompt) {
    console.log('Промпт изменен:', promptId, prompt);
    currentPrompt = prompt;
    
    // Обновляем приветственное сообщение
    updateWelcomeMessage(prompt);
    
    // Аналитика
    trackEvent('prompt_changed', {
        prompt_id: promptId,
        prompt_name: prompt.name,
        question_count: messageCount
    });
}

// Обновление приветственного сообщения
function updateWelcomeMessage(prompt) {
    if (!prompt) return;
    
    // Удаляем старое приветственное сообщение
    const oldWelcome = document.querySelector('.welcome-message');
    if (oldWelcome) {
        oldWelcome.remove();
    }
    
    // Добавляем новое приветственное сообщение
    const welcomeText = `Режим: ${prompt.name}\n\n${prompt.description}`;
    addMessage('ai', welcomeText, 'welcome-message');
}

// Проверка доступности backend
async function checkBackendHealth() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/health`, {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend подключен:', data);
            showConnectionStatus('connected', 'Подключен к backend');
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.warn('⚠️ Backend недоступен, используется локальная генерация ответов:', error.message);
        showConnectionStatus('disconnected', 'Локальный режим');
        // Продолжаем работу с локальными ответами
    }
}

// Показ статуса подключения
function showConnectionStatus(status, message) {
    // Создаем или обновляем индикатор статуса
    let statusIndicator = document.getElementById('connectionStatus');
    if (!statusIndicator) {
        statusIndicator = document.createElement('div');
        statusIndicator.id = 'connectionStatus';
        statusIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(statusIndicator);
    }
    
    if (status === 'connected') {
        statusIndicator.style.backgroundColor = '#4CAF50';
        statusIndicator.style.color = 'white';
        statusIndicator.textContent = `🟢 ${message}`;
    } else {
        statusIndicator.style.backgroundColor = '#FF9800';
        statusIndicator.style.color = 'white';
        statusIndicator.textContent = `🟡 ${message}`;
    }
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        if (statusIndicator) {
            statusIndicator.style.opacity = '0.7';
        }
    }, 3000);
}

// Инициализация приложения
function initializeApp() {
    // Фокус на поле ввода
    messageInput.focus();
    
    // Настройка адаптивной высоты
    setupResponsiveHeight();
    
    // Обработка клавиатуры на мобильных устройствах
    handleMobileKeyboard();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Отправка сообщения по Enter
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Отправка сообщения по клику на кнопку
    sendButton.addEventListener('click', sendMessage);
    
    // Валидация поля ввода
    messageInput.addEventListener('input', function() {
        const hasText = this.value.trim().length > 0;
        sendButton.disabled = !hasText || isLimitReached;
        
        // Автоматическое изменение высоты поля ввода
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Обработка изменения размера окна
    window.addEventListener('resize', setupResponsiveHeight);
    
    // Обработка видимости страницы
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            trackEvent('page_hidden');
        } else {
            trackEvent('page_visible');
        }
    });
}

// Добавление приветственного сообщения
function addWelcomeMessage() {
    const welcomeText = `Добро пожаловать! Выберите режим работы ИИ-ассистента в меню выше.

Доступные режимы:
• ИИ-ассистент Альфа-Банка - помощь по личным финансам
• Техническая поддержка - решение технических проблем
• Общий помощник - универсальный ассистент
• Ассистент по лояльности - кэшбэк и баллы`;
    
    addMessage('ai', welcomeText, 'welcome-message');
}

// Отправка сообщения
async function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText || isLimitReached) {
        return;
    }
    
    // Добавление сообщения пользователя
    addMessage('user', messageText);
    
    // Очистка поля ввода
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendButton.disabled = true;
    
    // Увеличение счетчика сообщений
    messageCount++;
    
    // Аналитика
    trackEvent('click_send', { 
        message_length: messageText.length,
        prompt_id: currentPrompt?.id || 'unknown'
    });
    
    // Проверка лимита
    if (messageCount >= CONFIG.MAX_MESSAGES) {
        showLimitPage();
        return;
    }
    
    // Получение ответа от backend или локальная генерация
    await getAIResponse(messageText);
}

// Получение ответа от ИИ
async function getAIResponse(userMessage) {
    if (isTyping) return;
    
    isTyping = true;
    
    // Показ индикатора печати
    setTimeout(() => {
        showTypingIndicator();
        
        // Попытка получить ответ от backend
        getBackendResponse(userMessage)
            .then(response => {
                hideTypingIndicator();
                addMessage('ai', response);
                isTyping = false;
                
                // Аналитика эффективности промпта
                trackPromptEffectiveness(currentPrompt?.id, response.length);
            })
            .catch(error => {
                console.warn('Backend недоступен, используем локальную генерацию:', error.message);
                hideTypingIndicator();
                const localResponse = generateLocalResponse(userMessage);
                addMessage('ai', localResponse);
                isTyping = false;
            });
    }, CONFIG.TYPING_DELAY);
}

// Запрос к backend API с промптом
async function getBackendResponse(message) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
    
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Добавляем заголовок с ID промпта, если он выбран
        if (currentPrompt) {
            headers['X-Prompt-ID'] = currentPrompt.id;
        }
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                message: message,
                promptcount: messageCount
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.reply) {
            throw new Error('Неожиданный формат ответа от сервера');
        }
        
        return data.reply;
        
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Локальная генерация ответов (fallback)
function generateLocalResponse(userMessage) {
    const responses = [
        "Спасибо за ваш вопрос! Я помогу вам с информацией о системе лояльности Альфа-Банка.",
        "Для получения кэшбэка убедитесь, что ваша карта участвует в программе лояльности.",
        "Баллы начисляются автоматически при совершении покупок у партнеров банка.",
        "Вы можете проверить баланс баллов в мобильном приложении или интернет-банке.",
        "Партнерские предложения обновляются ежемесячно. Рекомендую следить за актуальной информацией.",
        "Для активации специальных предложений может потребоваться регистрация в программе лояльности.",
        "Кэшбэк начисляется в течение 3-5 рабочих дней после совершения покупки.",
        "Баллы можно потратить на покупки у партнеров или обменять на мили.",
        "Если у вас есть вопросы по конкретному предложению, обратитесь в службу поддержки.",
        "Рекомендую подписаться на уведомления о новых акциях и предложениях."
    ];
    
    // Простая логика выбора ответа на основе ключевых слов
    const message = userMessage.toLowerCase();
    
    if (message.includes('кэшбэк') || message.includes('cashback')) {
        return "Кэшбэк начисляется автоматически при покупках у партнеров. Размер кэшбэка зависит от категории покупки и может составлять от 1% до 10% от суммы покупки.";
    } else if (message.includes('балл') || message.includes('очк')) {
        return "Баллы начисляются за каждую покупку у партнеров банка. 1 балл = 1 рубль. Баллы можно тратить на покупки или обменивать на мили.";
    } else if (message.includes('партнер') || message.includes('магазин')) {
        return "У нас более 1000 партнеров в различных категориях: рестораны, магазины, заправки, аптеки и многие другие. Полный список доступен в приложении.";
    } else if (message.includes('акци') || message.includes('предложен')) {
        return "Специальные предложения и акции обновляются регулярно. Рекомендую проверять актуальную информацию в мобильном приложении или на сайте банка.";
    } else if (message.includes('помощь') || message.includes('поддержк')) {
        return "Для получения персональной помощи обратитесь в службу поддержки по телефону 8 800 200-00-00 или через чат в мобильном приложении.";
    } else {
        // Случайный ответ из общего списка
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Добавление сообщения в чат
function addMessage(type, text, className = '') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} ${className}`;
    
    // Форматирование текста
    const formattedText = formatMessage(text);
    messageDiv.innerHTML = formattedText;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Анимация появления
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    requestAnimationFrame(() => {
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    });
}

// Форматирование сообщения
function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Жирный текст
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Курсив
        .replace(/\n/g, '<br>') // Переносы строк
        .replace(/^\- (.*$)/gm, '<li>$1</li>') // Списки
        .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>'); // Нумерованные списки
}

// Показ индикатора печати
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const promptName = currentPrompt ? currentPrompt.name : 'ИИ';
    
    typingDiv.innerHTML = `
        <span>${promptName} печатает</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Скрытие индикатора печати
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Показ страницы лимита
function showLimitPage() {
    isLimitReached = true;
    limitPage.style.display = 'flex';
    
    // Аналитика
    trackEvent('limit_reached', { 
        message_count: messageCount,
        final_prompt_id: currentPrompt?.id || 'unknown'
    });
    
    // Скрытие основного интерфейса
    document.querySelector('.app').style.display = 'none';
}

// Прокрутка к последнему сообщению
function scrollToBottom() {
    requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Настройка адаптивной высоты
function setupResponsiveHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Обработка мобильной клавиатуры
function handleMobileKeyboard() {
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
        const currentHeight = window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        // Если высота уменьшилась более чем на 150px, вероятно открылась клавиатура
        if (heightDifference > 150) {
            document.body.classList.add('keyboard-open');
            setTimeout(scrollToBottom, 300);
        } else {
            document.body.classList.remove('keyboard-open');
        }
    });
}

// Отслеживание эффективности промптов
function trackPromptEffectiveness(promptId, responseLength) {
    if (!promptId) return;
    
    trackEvent('prompt_effectiveness', {
        prompt_id: promptId,
        response_length: responseLength,
        question_count: messageCount
    });
}

// Аналитика событий
function trackEvent(eventName, parameters = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Yandex.Metrika
    if (typeof ym !== 'undefined') {
        ym(12345678, 'reachGoal', eventName, parameters);
    }
    
    // Локальное логирование для отладки
    console.log('Event tracked:', eventName, parameters);
}

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    trackEvent('error', { 
        message: e.message, 
        filename: e.filename, 
        lineno: e.lineno 
    });
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('unhandled_promise_rejection', { 
        reason: e.reason?.toString() || 'Unknown error' 
    });
});

// Экспорт функций для тестирования (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addMessage,
        formatMessage,
        generateLocalResponse,
        getBackendResponse,
        trackEvent,
        trackPromptEffectiveness
    };
}
