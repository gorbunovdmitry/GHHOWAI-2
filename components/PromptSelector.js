// Компонент для выбора системных промптов
class PromptSelector {
  constructor(containerId, onPromptChange) {
    this.container = document.getElementById(containerId);
    this.onPromptChange = onPromptChange;
    this.currentPrompt = null;
    this.prompts = [];
    this.init();
  }

  async init() {
    await this.loadPrompts();
    this.render();
    this.setupEventListeners();
  }

  async loadPrompts() {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      this.prompts = data.available;
      this.currentPrompt = data.current;
    } catch (error) {
      console.error('Ошибка загрузки промптов:', error);
      this.prompts = [];
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="prompt-selector">
        <div class="prompt-header">
          <h3>Режим работы ИИ</h3>
          <div class="prompt-status" id="promptStatus">
            <span class="status-indicator"></span>
            <span class="status-text">Загрузка...</span>
          </div>
        </div>
        
        <div class="prompt-controls">
          <select id="promptSelect" class="prompt-select">
            <option value="">Выберите режим...</option>
            ${this.prompts.map(prompt => `
              <option value="${prompt.id}" ${prompt.id === this.currentPrompt?.id ? 'selected' : ''}>
                ${prompt.name} (v${prompt.version})
              </option>
            `).join('')}
          </select>
          
          <button id="refreshPrompts" class="refresh-btn" title="Обновить список">
            🔄
          </button>
        </div>
        
        <div class="prompt-description" id="promptDescription">
          ${this.currentPrompt ? this.currentPrompt.description : 'Выберите режим работы'}
        </div>
        
        <div class="prompt-actions">
          <button id="showStats" class="stats-btn">📊 Статистика</button>
          <button id="showHistory" class="history-btn">📝 История</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const select = document.getElementById('promptSelect');
    const refreshBtn = document.getElementById('refreshPrompts');
    const statsBtn = document.getElementById('showStats');
    const historyBtn = document.getElementById('showHistory');

    if (select) {
      select.addEventListener('change', (e) => {
        this.handlePromptChange(e.target.value);
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadPrompts().then(() => this.render());
      });
    }

    if (statsBtn) {
      statsBtn.addEventListener('click', () => {
        this.showStats();
      });
    }

    if (historyBtn) {
      historyBtn.addEventListener('click', () => {
        this.showHistory();
      });
    }
  }

  async handlePromptChange(promptId) {
    if (!promptId) return;

    try {
      const response = await fetch('/api/prompts/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId })
      });

      if (response.ok) {
        const data = await response.json();
        this.currentPrompt = data.currentPrompt;
        this.updateStatus('success', `Режим изменен: ${this.currentPrompt.name}`);
        
        // Обновляем описание
        const description = document.getElementById('promptDescription');
        if (description) {
          description.textContent = this.currentPrompt.description;
        }

        // Вызываем callback
        if (this.onPromptChange) {
          this.onPromptChange(promptId, this.currentPrompt);
        }

        // Аналитика
        this.trackEvent('prompt_changed', {
          new_prompt_id: promptId,
          new_prompt_name: this.currentPrompt.name
        });
      } else {
        this.updateStatus('error', 'Ошибка смены режима');
      }
    } catch (error) {
      console.error('Ошибка смены промпта:', error);
      this.updateStatus('error', 'Ошибка соединения');
    }
  }

  updateStatus(type, message) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
      statusIndicator.className = `status-indicator ${type}`;
      statusText.textContent = message;
      
      // Скрываем статус через 3 секунды
      setTimeout(() => {
        statusText.textContent = this.currentPrompt ? this.currentPrompt.name : 'Готов';
        statusIndicator.className = 'status-indicator';
      }, 3000);
    }
  }

  async showStats() {
    try {
      const response = await fetch('/api/prompts/stats');
      const data = await response.json();
      
      const stats = data.metrics;
      const currentPrompt = data.currentPrompt;
      
      let statsHtml = `
        <div class="stats-modal">
          <div class="stats-header">
            <h3>📊 Статистика промптов</h3>
            <button class="close-btn" onclick="this.closest('.stats-modal').remove()">×</button>
          </div>
          <div class="stats-content">
            <div class="current-prompt">
              <h4>Текущий режим: ${currentPrompt.name}</h4>
              <p>${currentPrompt.description}</p>
            </div>
            <div class="metrics">
      `;
      
      Object.entries(stats).forEach(([key, metric]) => {
        if (metric) {
          const promptId = key.replace('prompt_', '');
          statsHtml += `
            <div class="metric-item">
              <h5>${promptId}</h5>
              <div class="metric-details">
                <span>Использований: ${metric.usageCount}</span>
                <span>Среднее время: ${Math.round(metric.averageResponseTime)}мс</span>
                <span>Успешность: ${Math.round(metric.successRate * 100)}%</span>
              </div>
            </div>
          `;
        }
      });
      
      statsHtml += `
            </div>
          </div>
        </div>
      `;
      
      // Создаем модальное окно
      const modal = document.createElement('div');
      modal.innerHTML = statsHtml;
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
      
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      this.updateStatus('error', 'Ошибка загрузки статистики');
    }
  }

  async showHistory() {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      const history = data.history;
      
      let historyHtml = `
        <div class="history-modal">
          <div class="history-header">
            <h3>📝 История смены режимов</h3>
            <button class="close-btn" onclick="this.closest('.history-modal').remove()">×</button>
          </div>
          <div class="history-content">
      `;
      
      if (history.length === 0) {
        historyHtml += '<p>История пуста</p>';
      } else {
        history.forEach(change => {
          const date = new Date(change.timestamp).toLocaleString();
          historyHtml += `
            <div class="history-item">
              <span class="time">${date}</span>
              <span class="change">${change.from} → ${change.to}</span>
            </div>
          `;
        });
      }
      
      historyHtml += `
          </div>
        </div>
      `;
      
      // Создаем модальное окно
      const modal = document.createElement('div');
      modal.innerHTML = historyHtml;
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
      
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      this.updateStatus('error', 'Ошибка загрузки истории');
    }
  }

  trackEvent(eventName, parameters = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
    
    // Yandex.Metrika
    if (typeof ym !== 'undefined') {
      ym(12345678, 'reachGoal', eventName, parameters);
    }
    
    console.log('Event tracked:', eventName, parameters);
  }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptSelector;
} else {
  window.PromptSelector = PromptSelector;
}
