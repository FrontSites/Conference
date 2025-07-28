// Advanced Notification System for Windows
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';

const execAsync = promisify(exec);

class NotificationSystem {
  constructor() {
    this.isEnabled = true;
    this.soundEnabled = true;
    this.toastEnabled = true;
    this.logFile = 'notifications.log';
  }

  async init() {
    console.log('🔔 Система уведомлений инициализирована');
    
    // Проверяем поддержку Windows Toast
    if (process.platform === 'win32') {
      try {
        await execAsync('powershell -Command "Get-Command New-BurntToastNotification -ErrorAction SilentlyContinue"');
        console.log('✅ BurntToast модуль доступен');
      } catch {
        console.log('⚠️ Для лучших уведомлений установите: Install-Module -Name BurntToast');
      }
    }
  }

  async notify(type, title, message, options = {}) {
    if (!this.isEnabled) return;

    const notification = {
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    // Логируем уведомление
    await this.logNotification(notification);

    // Консольное уведомление с цветами
    this.consoleNotify(notification);

    // Windows Toast уведомление
    if (this.toastEnabled && process.platform === 'win32') {
      await this.windowsToast(notification);
    }

    // Звуковое уведомление
    if (this.soundEnabled) {
      await this.playSound(type);
    }
  }

  consoleNotify({ type, title, message }) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      build: '🏗️',
      deploy: '🚀'
    };

    const colors = {
      success: '\x1b[32m', // Зелёный
      error: '\x1b[31m',   // Красный
      warning: '\x1b[33m', // Жёлтый
      info: '\x1b[36m',    // Циан
      build: '\x1b[35m',   // Пурпурный
      deploy: '\x1b[34m'   // Синий
    };

    const reset = '\x1b[0m';
    const icon = icons[type] || 'ℹ️';
    const color = colors[type] || colors.info;

    console.log(`\n${color}${icon} ${title}${reset}`);
    console.log(`${color}${message}${reset}\n`);
  }

  async windowsToast({ type, title, message, duration = 5000 }) {
    try {
      const icons = {
        success: '✅',
        error: '❌', 
        warning: '⚠️',
        info: 'ℹ️',
        build: '🏗️',
        deploy: '🚀'
      };

      const icon = icons[type] || 'ℹ️';
      const fullTitle = `${icon} ${title}`;

      // Простое Windows уведомление
      const simpleCommand = `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${message}', '${fullTitle}', 'OK', 'Information')"`;
      
      // Попробуем BurntToast для лучшего уведомления
      const toastCommand = `powershell -Command "
        try {
          Import-Module BurntToast -ErrorAction Stop;
          New-BurntToastNotification -Text '${fullTitle}', '${message}' -AppLogo 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
        } catch {
          [System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms');
          [System.Windows.Forms.MessageBox]::Show('${message}', '${fullTitle}', 'OK', 'Information');
        }
      "`;

      await execAsync(toastCommand);
    } catch (error) {
      // Fallback - просто в консоль
      console.log(`🔔 ${title}: ${message}`);
    }
  }

  async playSound(type) {
    try {
      const sounds = {
        success: 'SystemAsterisk',
        error: 'SystemHand',
        warning: 'SystemExclamation',
        info: 'SystemNotification',
        build: 'SystemQuestion',
        deploy: 'SystemAsterisk'
      };

      const sound = sounds[type] || 'SystemNotification';
      
      const command = `powershell -Command "[System.Media.SystemSounds]::${sound}.Play()"`;
      await execAsync(command);
    } catch {
      // Fallback - простой beep
      process.stdout.write('\x07');
    }
  }

  async logNotification(notification) {
    try {
      const logEntry = `[${notification.timestamp}] ${notification.type.toUpperCase()}: ${notification.title} - ${notification.message}\n`;
      await fs.appendFile(this.logFile, logEntry);
    } catch {
      // Игнорируем ошибки логирования
    }
  }

  // Предустановленные уведомления для частых случаев
  async success(title, message) {
    return this.notify('success', title, message);
  }

  async error(title, message) {
    return this.notify('error', title, message);
  }

  async warning(title, message) {
    return this.notify('warning', title, message);
  }

  async buildComplete(duration) {
    return this.notify('build', 'Сборка завершена', `Время сборки: ${duration}ms`, { duration });
  }

  async deployReady(projectName) {
    return this.notify('deploy', 'Готово к деплою', `Проект ${projectName} готов к загрузке`, { projectName });
  }

  async compilationError(file, error) {
    return this.notify('error', 'Ошибка компиляции', `${file}: ${error}`, { file, error });
  }

  async imageConverted(originalFile, webpFile, savings) {
    const message = `${originalFile} → ${webpFile}\nЭкономия: ${savings}%`;
    return this.notify('success', 'Изображение конвертировано', message, { originalFile, webpFile, savings });
  }

  async performanceAlert(metric, value, threshold) {
    const message = `${metric}: ${value} (превышен лимит ${threshold})`;
    return this.notify('warning', 'Предупреждение о производительности', message, { metric, value, threshold });
  }

  // Настройки системы
  enable() {
    this.isEnabled = true;
    console.log('🔔 Уведомления включены');
  }

  disable() {
    this.isEnabled = false;
    console.log('🔕 Уведомления отключены');
  }

  enableSound() {
    this.soundEnabled = true;
    console.log('🔊 Звуковые уведомления включены');
  }

  disableSound() {
    this.soundEnabled = false;
    console.log('🔇 Звуковые уведомления отключены');
  }

  async testNotifications() {
    console.log('🧪 Тестирование системы уведомлений...');
    
    await this.success('Тест успеха', 'Это тестовое уведомление об успехе');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.warning('Тест предупреждения', 'Это тестовое предупреждение');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.error('Тест ошибки', 'Это тестовое уведомление об ошибке');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.buildComplete(1234);
    
    console.log('✅ Тестирование завершено');
  }

  async getStats() {
    try {
      const logContent = await fs.readFile(this.logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      const stats = {
        total: lines.length,
        byType: {}
      };

      lines.forEach(line => {
        const match = line.match(/\] (\w+):/);
        if (match) {
          const type = match[1].toLowerCase();
          stats.byType[type] = (stats.byType[type] || 0) + 1;
        }
      });

      return stats;
    } catch {
      return { total: 0, byType: {} };
    }
  }
}

// Создаём глобальный экземпляр
const notifications = new NotificationSystem();

// CLI команды
if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case '--test':
      notifications.init().then(() => notifications.testNotifications());
      break;
    case '--stats':
      notifications.getStats().then(stats => {
        console.log('\n📊 СТАТИСТИКА УВЕДОМЛЕНИЙ:');
        console.log(`Всего: ${stats.total}`);
        Object.entries(stats.byType).forEach(([type, count]) => {
          console.log(`${type.toUpperCase()}: ${count}`);
        });
      });
      break;
    case '--disable-sound':
      notifications.disableSound();
      break;
    case '--enable-sound':
      notifications.enableSound();
      break;
    default:
      console.log(`
🔔 КОМАНДЫ СИСТЕМЫ УВЕДОМЛЕНИЙ:
  --test           Тестировать уведомления
  --stats          Показать статистику
  --disable-sound  Отключить звук
  --enable-sound   Включить звук
      `);
  }
}

export default notifications; 