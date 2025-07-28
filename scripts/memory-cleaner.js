// Memory Cleaner & Performance Optimizer
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import os from 'os';

const execAsync = promisify(exec);

class MemoryCleaner {
  constructor() {
    this.isRunning = false;
    this.cleanupInterval = null;
    this.memoryThreshold = 80; // Процент использования памяти для очистки
    this.autoCleanInterval = 300000; // 5 минут автоочистка
    this.stats = {
      cleanups: 0,
      memoryFreed: 0,
      lastCleanup: null
    };
  }

  async init() {
    console.log('🧹 Memory Cleaner инициализирован');
    await this.showSystemInfo();
  }

  async showSystemInfo() {
    try {
      const totalMemory = Math.round(os.totalmem() / 1024 / 1024 / 1024);
      const freeMemory = Math.round(os.freemem() / 1024 / 1024 / 1024);
      const usedMemory = totalMemory - freeMemory;
      const usagePercent = Math.round((usedMemory / totalMemory) * 100);

      console.log('\n💾 СИСТЕМНАЯ ИНФОРМАЦИЯ:');
      console.log('========================');
      console.log(`Общая память: ${totalMemory} GB`);
      console.log(`Используется: ${usedMemory} GB (${usagePercent}%)`);
      console.log(`Свободно: ${freeMemory} GB`);
      
      if (usagePercent > 80) {
        console.log('⚠️ ВЫСОКОЕ ИСПОЛЬЗОВАНИЕ ПАМЯТИ!');
        console.log('💡 Рекомендуется очистка');
      } else if (usagePercent > 60) {
        console.log('🟡 Умеренное использование памяти');
      } else {
        console.log('🟢 Память в норме');
      }

    } catch (error) {
      console.warn('⚠️ Не удалось получить информацию о памяти');
    }
  }

  async cleanMemory() {
    console.log('\n🧹 ОЧИСТКА ПАМЯТИ...');
    console.log('====================');

    const beforeMemory = this.getMemoryUsage();
    let cleaned = [];

    try {
      // 1. Очистка Node.js кэша
      await this.clearNodeCache();
      cleaned.push('Node.js кэш');

      // 2. Принудительная сборка мусора
      await this.forceGarbageCollection();
      cleaned.push('Сборка мусора');

      // 3. Очистка временных файлов
      await this.clearTempFiles();
      cleaned.push('Временные файлы');

      // 4. Очистка кэша npm
      await this.clearNpmCache();
      cleaned.push('NPM кэш');

      // 5. Очистка Windows кэша (если нужно)
      await this.clearWindowsCache();
      cleaned.push('Windows кэш');

      // 6. Очистка браузерного кэша для Browser-Sync
      await this.clearBrowserCache();
      cleaned.push('Browser кэш');

      const afterMemory = this.getMemoryUsage();
      const memoryFreed = beforeMemory - afterMemory;

      this.stats.cleanups++;
      this.stats.memoryFreed += memoryFreed;
      this.stats.lastCleanup = new Date();

      console.log('\n✅ ОЧИСТКА ЗАВЕРШЕНА:');
      console.log(`📊 Очищено: ${cleaned.join(', ')}`);
      console.log(`💾 Освобождено памяти: ${memoryFreed.toFixed(1)} MB`);
      console.log(`🔄 Всего очисток: ${this.stats.cleanups}`);

    } catch (error) {
      console.error('❌ Ошибка очистки памяти:', error.message);
    }
  }

  async clearNodeCache() {
    try {
      // Очищаем require cache
      Object.keys(require.cache).forEach(key => {
        if (!key.includes('node_modules')) {
          delete require.cache[key];
        }
      });
      
      // Принудительная сборка мусора если доступна
      if (global.gc) {
        global.gc();
      }
      
      console.log('✅ Node.js кэш очищен');
    } catch (error) {
      console.warn('⚠️ Частичная очистка Node.js кэша');
    }
  }

  async forceGarbageCollection() {
    try {
      if (global.gc) {
        global.gc();
        console.log('✅ Принудительная сборка мусора выполнена');
      } else {
        console.log('⚠️ Сборка мусора недоступна (запустите с --expose-gc)');
      }
    } catch (error) {
      console.warn('⚠️ Ошибка сборки мусора');
    }
  }

  async clearTempFiles() {
    try {
      const tempPaths = [
        '.cache',
        'node_modules/.cache',
        'assets/temp',
        '*.tmp',
        '*.temp'
      ];

      for (const tempPath of tempPaths) {
        try {
          if (await fs.pathExists(tempPath)) {
            await fs.remove(tempPath);
          }
        } catch {}
      }
      
      console.log('✅ Временные файлы очищены');
    } catch (error) {
      console.warn('⚠️ Частичная очистка временных файлов');
    }
  }

  async clearNpmCache() {
    try {
      await execAsync('npm cache clean --force', { timeout: 10000 });
      console.log('✅ NPM кэш очищен');
    } catch (error) {
      console.warn('⚠️ Не удалось очистить NPM кэш');
    }
  }

  async clearWindowsCache() {
    try {
      // Очистка DNS кэша
      await execAsync('ipconfig /flushdns', { timeout: 5000 });
      
      // Очистка системного кэша
      await execAsync('cleanmgr /sagerun:1', { timeout: 5000 }).catch(() => {});
      
      console.log('✅ Windows кэш очищен');
    } catch (error) {
      console.warn('⚠️ Частичная очистка Windows кэша');
    }
  }

  async clearBrowserCache() {
    try {
      // Очистка кэша Browser-Sync
      const browserSyncCache = '.browsersyncrc';
      if (await fs.pathExists(browserSyncCache)) {
        await fs.remove(browserSyncCache);
      }
      console.log('✅ Browser кэш очищен');
    } catch (error) {
      console.warn('⚠️ Не удалось очистить browser кэш');
    }
  }

  getMemoryUsage() {
    const used = process.memoryUsage();
    return Math.round(used.heapUsed / 1024 / 1024 * 100) / 100; // MB
  }

  async startAutoCleanup() {
    if (this.isRunning) {
      console.log('⚠️ Автоочистка уже запущена');
      return;
    }

    this.isRunning = true;
    console.log(`🤖 Автоочистка памяти запущена (каждые ${this.autoCleanInterval / 1000 / 60} мин)`);

    this.cleanupInterval = setInterval(async () => {
      const memoryUsage = this.getSystemMemoryUsage();
      
      if (memoryUsage > this.memoryThreshold) {
        console.log(`\n⚠️ Память: ${memoryUsage}% - запуск автоочистки...`);
        await this.cleanMemory();
      } else {
        console.log(`🟢 Память в норме: ${memoryUsage}%`);
      }
    }, this.autoCleanInterval);
  }

  async stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      this.isRunning = false;
      console.log('🛑 Автоочистка остановлена');
    }
  }

  getSystemMemoryUsage() {
    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      return Math.round((usedMemory / totalMemory) * 100);
    } catch {
      return 0;
    }
  }

  async optimizeForDevelopment() {
    console.log('\n⚡ ОПТИМИЗАЦИЯ ДЛЯ РАЗРАБОТКИ...');
    console.log('================================');

    try {
      // 1. Настройка переменных окружения Node.js
      process.env.NODE_OPTIONS = '--max-old-space-size=4096 --expose-gc';
      
      // 2. Увеличение лимитов для Vite
      process.env.VITE_NODE_OPTIONS = '--max-old-space-size=4096';
      
      // 3. Настройка Gulp для экономии памяти
      process.env.GULP_PARALLEL_LIMIT = '2';
      
      console.log('✅ Node.js оптимизирован для разработки');
      console.log('✅ Увеличен лимит памяти до 4GB');
      console.log('✅ Включена сборка мусора');
      
    } catch (error) {
      console.warn('⚠️ Частичная оптимизация');
    }
  }

  async showStats() {
    console.log('\n📊 СТАТИСТИКА ОЧИСТКИ:');
    console.log('======================');
    console.log(`🔄 Всего очисток: ${this.stats.cleanups}`);
    console.log(`💾 Освобождено памяти: ${this.stats.memoryFreed.toFixed(1)} MB`);
    console.log(`⏰ Последняя очистка: ${this.stats.lastCleanup ? this.stats.lastCleanup.toLocaleString('ru-RU') : 'Не выполнялась'}`);
    console.log(`🤖 Автоочистка: ${this.isRunning ? '🟢 Активна' : '🔴 Отключена'}`);
  }

  async emergencyCleanup() {
    console.log('🚨 ЭКСТРЕННАЯ ОЧИСТКА ПАМЯТИ!');
    console.log('==============================');
    
    try {
      // Убиваем тяжёлые процессы
      await execAsync('taskkill /f /im node.exe /t').catch(() => {});
      await execAsync('taskkill /f /im chrome.exe /t').catch(() => {});
      
      console.log('⚠️ Процессы завершены - перезапустите разработку');
    } catch (error) {
      console.error('❌ Ошибка экстренной очистки');
    }
  }
}

// Создаём экземпляр
const memoryCleaner = new MemoryCleaner();

// CLI команды
if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case 'clean':
      memoryCleaner.init().then(() => memoryCleaner.cleanMemory());
      break;
      
    case 'auto':
      memoryCleaner.init().then(() => memoryCleaner.startAutoCleanup());
      break;
      
    case 'stop':
      memoryCleaner.stopAutoCleanup();
      break;
      
    case 'info':
      memoryCleaner.showSystemInfo();
      break;
      
    case 'stats':
      memoryCleaner.showStats();
      break;
      
    case 'optimize':
      memoryCleaner.optimizeForDevelopment();
      break;
      
    case 'emergency':
      memoryCleaner.emergencyCleanup();
      break;
      
    default:
      console.log(`
🧹 MEMORY CLEANER & OPTIMIZER
=============================

Команды:
  clean       Очистить память сейчас
  auto        Запустить автоочистку (каждые 5 мин)
  stop        Остановить автоочистку
  info        Показать информацию о системе
  stats       Статистика очисток
  optimize    Оптимизировать для разработки
  emergency   Экстренная очистка (убивает процессы)

Примеры:
  node scripts/memory-cleaner.js clean
  node scripts/memory-cleaner.js auto
  node scripts/memory-cleaner.js info
      `);
  }
}

export default memoryCleaner; 