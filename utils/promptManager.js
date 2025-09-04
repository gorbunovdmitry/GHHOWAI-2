import { SYSTEM_PROMPTS } from '../prompts/systemPrompts.js';

export class PromptManager {
  constructor() {
    this.currentPrompt = SYSTEM_PROMPTS.JKU_ASSISTANT;
    this.promptHistory = [];
  }

  // Получить текущий промпт
  getCurrentPrompt() {
    return this.currentPrompt;
  }

  // Установить промпт по ID
  setPrompt(promptId) {
    const prompt = SYSTEM_PROMPTS[promptId];
    if (prompt) {
      this.promptHistory.push({
        from: this.currentPrompt.id,
        to: promptId,
        timestamp: Date.now()
      });
      this.currentPrompt = prompt;
      return true;
    }
    return false;
  }

  // Получить все доступные промпты
  getAvailablePrompts() {
    return Object.values(SYSTEM_PROMPTS).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      version: p.version
    }));
  }

  // Получить историю изменений
  getPromptHistory() {
    return this.promptHistory;
  }

  // Создать кастомный промпт
  createCustomPrompt(id, name, description, prompt) {
    const customPrompt = {
      id,
      name,
      description,
      prompt,
      version: '1.0.0',
      isCustom: true
    };
    
    SYSTEM_PROMPTS[id] = customPrompt;
    return customPrompt;
  }

  // Валидация промпта
  validatePrompt(prompt) {
    const issues = [];
    
    if (!prompt || typeof prompt !== 'string') {
      issues.push('Промпт должен быть строкой');
    }
    
    if (prompt.length < 50) {
      issues.push('Промпт слишком короткий (минимум 50 символов)');
    }
    
    if (prompt.length > 10000) {
      issues.push('Промпт слишком длинный (максимум 10000 символов)');
    }
    
    // Проверка на запрещенные слова
    const forbiddenWords = ['взлом', 'взломать', 'обойти', 'хак'];
    const hasForbiddenWords = forbiddenWords.some(word => 
      prompt.toLowerCase().includes(word)
    );
    
    if (hasForbiddenWords) {
      issues.push('Промпт содержит запрещенные слова');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
