export class PromptSecurity {
  static validatePrompt(prompt) {
    const securityChecks = [
      this.checkForbiddenWords,
      this.checkPromptInjection,
      this.checkDataLeakage,
      this.checkSystemBypass
    ];
    
    const issues = [];
    securityChecks.forEach(check => {
      const result = check(prompt);
      if (result.hasIssues) {
        issues.push(...result.issues);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
  
  static checkForbiddenWords(prompt) {
    const forbiddenWords = [
      'ignore previous instructions',
      'forget everything',
      'you are now',
      'pretend to be',
      'act as if'
    ];
    
    const issues = forbiddenWords.filter(word => 
      prompt.toLowerCase().includes(word.toLowerCase())
    );
    
    return {
      hasIssues: issues.length > 0,
      issues: issues.map(word => `Запрещенное слово: ${word}`)
    };
  }
  
  static checkPromptInjection(prompt) {
    const injectionPatterns = [
      /system\s*:/i,
      /assistant\s*:/i,
      /user\s*:/i,
      /<script/i,
      /javascript:/i
    ];
    
    const issues = injectionPatterns.filter(pattern => 
      pattern.test(prompt)
    );
    
    return {
      hasIssues: issues.length > 0,
      issues: issues.map(() => 'Обнаружена попытка инъекции промпта')
    };
  }
  
  static checkDataLeakage(prompt) {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /private\s+key/i,
      /api\s+key/i,
      /token/i
    ];
    
    const issues = sensitivePatterns.filter(pattern => 
      pattern.test(prompt)
    );
    
    return {
      hasIssues: issues.length > 0,
      issues: issues.map(() => 'Обнаружена утечка чувствительных данных')
    };
  }
  
  static checkSystemBypass(prompt) {
    const bypassPatterns = [
      /override/i,
      /bypass/i,
      /hack/i,
      /exploit/i,
      /vulnerability/i
    ];
    
    const issues = bypassPatterns.filter(pattern => 
      pattern.test(prompt)
    );
    
    return {
      hasIssues: issues.length > 0,
      issues: issues.map(() => 'Обнаружена попытка обхода системы')
    };
  }
}
