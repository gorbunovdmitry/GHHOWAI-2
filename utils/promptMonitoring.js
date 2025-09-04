export class PromptMonitoring {
  constructor() {
    this.metrics = new Map();
  }
  
  // Отслеживание использования промптов
  trackPromptUsage(promptId, responseTime, success) {
    const key = `prompt_${promptId}`;
    const current = this.metrics.get(key) || {
      usageCount: 0,
      totalResponseTime: 0,
      successCount: 0,
      errorCount: 0
    };
    
    current.usageCount++;
    current.totalResponseTime += responseTime;
    
    if (success) {
      current.successCount++;
    } else {
      current.errorCount++;
    }
    
    this.metrics.set(key, current);
  }
  
  // Получение статистики
  getPromptStats(promptId) {
    const key = `prompt_${promptId}`;
    const stats = this.metrics.get(key);
    
    if (!stats) return null;
    
    return {
      usageCount: stats.usageCount,
      averageResponseTime: stats.totalResponseTime / stats.usageCount,
      successRate: stats.successCount / stats.usageCount,
      errorRate: stats.errorCount / stats.usageCount
    };
  }
  
  // Получение всех метрик
  getAllMetrics() {
    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = this.getPromptStats(key.replace('prompt_', ''));
    });
    return result;
  }
}
