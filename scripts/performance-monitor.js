// Performance Monitor System
import fs from 'fs-extra';
import path from 'path';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      startTime: null,
      compilations: {
        scss: { count: 0, totalTime: 0, averageTime: 0 },
        js: { count: 0, totalTime: 0, averageTime: 0 },
        images: { count: 0, totalTime: 0, averageTime: 0 },
        php: { count: 0, totalTime: 0, averageTime: 0 }
      },
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage()
      }
    };
    this.logFile = 'performance.log';
  }

  start() {
    this.metrics.startTime = Date.now();
    console.log('📊 Performance Monitor запущен');
  }

  trackCompilation(type, duration) {
    if (!this.metrics.compilations[type]) return;
    
    const metric = this.metrics.compilations[type];
    metric.count++;
    metric.totalTime += duration;
    metric.averageTime = metric.totalTime / metric.count;
    
    this.logMetric(type, duration);
  }

  logMetric(type, duration) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${duration}ms\n`;
    
    fs.appendFile(this.logFile, logEntry).catch(() => {});
    
    // Цветной вывод в консоль
    const color = duration < 100 ? '🟢' : duration < 500 ? '🟡' : '🔴';
    console.log(`${color} ${type.toUpperCase()}: ${duration}ms`);
  }

  getStats() {
    const uptime = this.metrics.startTime ? Date.now() - this.metrics.startTime : 0;
    
    return {
      uptime: Math.round(uptime / 1000),
      compilations: this.metrics.compilations,
      memory: process.memoryUsage(),
      systemInfo: this.metrics.systemInfo
    };
  }

  generateReport() {
    const stats = this.getStats();
    const report = `
📊 ОТЧЁТ О ПРОИЗВОДИТЕЛЬНОСТИ
============================

⏰ Время работы: ${Math.floor(stats.uptime / 60)}м ${stats.uptime % 60}с

📈 СТАТИСТИКА КОМПИЛЯЦИЙ:
${Object.entries(stats.compilations).map(([type, data]) => 
  `  ${type.toUpperCase()}: ${data.count} раз, среднее время: ${Math.round(data.averageTime)}ms`
).join('\n')}

💾 ПАМЯТЬ:
  Используется: ${Math.round(stats.memory.heapUsed / 1024 / 1024)}MB
  Всего выделено: ${Math.round(stats.memory.heapTotal / 1024 / 1024)}MB

🖥️ СИСТЕМА:
  Node.js: ${stats.systemInfo.nodeVersion}
  Платформа: ${stats.systemInfo.platform}
  Архитектура: ${stats.systemInfo.arch}

🎯 РЕКОМЕНДАЦИИ:
${this.getRecommendations(stats)}
`;

    console.log(report);
    fs.writeFile('performance-report.txt', report).catch(() => {});
    
    return report;
  }

  getRecommendations(stats) {
    const recommendations = [];
    
    // Анализ производительности SCSS
    if (stats.compilations.scss.averageTime > 1000) {
      recommendations.push('  • SCSS компиляция медленная - рассмотри разбивку файлов');
    }
    
    // Анализ JS
    if (stats.compilations.js.averageTime > 2000) {
      recommendations.push('  • JS минификация медленная - проверь размер файлов');
    }
    
    // Анализ памяти
    if (stats.memory.heapUsed > 100 * 1024 * 1024) {
      recommendations.push('  • Высокое потребление памяти - перезапусти систему');
    }
    
    // Анализ количества компиляций
    const totalCompilations = Object.values(stats.compilations).reduce((sum, data) => sum + data.count, 0);
    if (totalCompilations > 100) {
      recommendations.push('  • Много компиляций - рассмотри использование кэширования');
    }
    
    return recommendations.length > 0 ? recommendations.join('\n') : '  • Всё отлично! Система работает оптимально 🚀';
  }

  // Автоматическая очистка старых логов
  cleanup() {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней
    
    fs.stat(this.logFile).then(stats => {
      if (Date.now() - stats.mtime.getTime() > maxAge) {
        fs.remove(this.logFile);
        console.log('🧹 Старые логи производительности очищены');
      }
    }).catch(() => {});
  }
}

// Создаём глобальный экземпляр
const monitor = new PerformanceMonitor();

// Экспортируем для использования в gulpfile
export default monitor;

// Утилиты для измерения времени
export function measureTime(fn, type) {
  return async (...args) => {
    const start = Date.now();
    const result = await fn(...args);
    const duration = Date.now() - start;
    
    monitor.trackCompilation(type, duration);
    return result;
  };
}

// Команда для генерации отчёта
if (process.argv[2] === '--report') {
  monitor.generateReport();
} 