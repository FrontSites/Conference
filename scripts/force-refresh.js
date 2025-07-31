// Force Refresh Script - Принудительное обновление кэша
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

class ForceRefresh {
  constructor() {
    this.cssPath = 'assets/css/main.min.css';
    this.jsPath = 'assets/js/main.min.js';
  }

  async forceRefresh() {
    console.log('🔄 Принудительное обновление кэша...');
    
    try {
      // 1. Компилируем файлы
      console.log('⚡ Компиляция файлов...');
      await execAsync('npm run scss');
      await execAsync('npm run js');
      
      // 2. Проверяем что файлы обновились
      const cssStats = await fs.stat(this.cssPath);
      const jsStats = await fs.stat(this.jsPath);
      
      console.log(`✅ CSS обновлён: ${cssStats.mtime.toLocaleString()}`);
      console.log(`✅ JS обновлён: ${jsStats.mtime.toLocaleString()}`);
      
      // 3. Создаём файл-маркер для принудительного обновления
      const markerContent = `/* Force Refresh Marker - ${new Date().toISOString()} */\n`;
      await fs.appendFile(this.cssPath, markerContent);
      
      console.log('🎯 Кэш браузера будет принудительно обновлён');
      console.log('💡 Обновите страницу в браузере (Ctrl+F5)');
      
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка принудительного обновления:', error.message);
      return false;
    }
  }

  async watchAndRefresh() {
    console.log('👀 Отслеживание изменений с принудительным обновлением...');
    
    const chokidar = await import('chokidar');
    
    const watcher = chokidar.default.watch(['src/**/*.scss', 'src/**/*.js'], {
      ignored: ['**/node_modules/**'],
      persistent: true
    });

    watcher.on('change', async (filePath) => {
      console.log(`📝 Изменён: ${path.basename(filePath)}`);
      await this.forceRefresh();
    });

    console.log('✅ Отслеживание активировано');
  }
}

// CLI запуск
const forceRefresh = new ForceRefresh();

if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case 'refresh':
      forceRefresh.forceRefresh();
      break;
      
    case 'watch':
      forceRefresh.watchAndRefresh();
      break;
      
    default:
      console.log(`
🔄 FORCE REFRESH - ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ КЭША
================================================

Команды:
  refresh   Принудительно обновить кэш
  watch     Отслеживать изменения с автообновлением

Примеры:
  node scripts/force-refresh.js refresh
  node scripts/force-refresh.js watch
      `);
  }
} else {
  // По умолчанию принудительное обновление
  forceRefresh.forceRefresh();
}

export default forceRefresh; 