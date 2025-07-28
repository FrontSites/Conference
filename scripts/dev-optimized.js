// Optimized Development Mode with Memory Management
import { spawn } from 'child_process';
import memoryCleaner from './memory-cleaner.js';

class OptimizedDev {
  constructor() {
    this.processes = [];
    this.isRunning = false;
  }

  async start() {
    console.log(`
⚡ ОПТИМИЗИРОВАННАЯ РАЗРАБОТКА
==============================

🧹 Автоочистка памяти: каждые 5 минут
🚀 Разработка: Vite + Gulp + Git автоматизация
💾 Мониторинг: производительность + память
    `);

    try {
      // 1. Оптимизация системы
      await this.optimizeSystem();
      
      // 2. Запуск автоочистки памяти
      await this.startMemoryManagement();
      
      // 3. Запуск разработки
      await this.startDevelopment();
      
      // 4. Настройка обработчиков
      this.setupSignalHandlers();
      
      this.isRunning = true;
      console.log('\n✅ Оптимизированная разработка запущена!');
      console.log('💡 Для остановки нажмите Ctrl+C');
      
    } catch (error) {
      console.error('❌ Ошибка запуска:', error.message);
      await this.cleanup();
    }
  }

  async optimizeSystem() {
    console.log('⚡ Оптимизация системы...');
    
    // Устанавливаем переменные окружения для оптимизации
    process.env.NODE_OPTIONS = '--max-old-space-size=4096 --expose-gc';
    process.env.VITE_NODE_OPTIONS = '--max-old-space-size=4096';
    process.env.UV_THREADPOOL_SIZE = '128';
    
    console.log('✅ Система оптимизирована');
  }

  async startMemoryManagement() {
    console.log('🧹 Запуск управления памятью...');
    
    // Инициализируем и запускаем автоочистку
    await memoryCleaner.init();
    await memoryCleaner.startAutoCleanup();
    
    console.log('✅ Управление памятью активировано');
  }

  async startDevelopment() {
    console.log('🚀 Запуск разработки...');
    
    // Запускаем основные процессы
    const processes = [
      {
        name: 'Vite Dev Server',
        command: 'npm',
        args: ['run', 'vite-only'],
        color: '\x1b[36m' // Cyan
      },
      {
        name: 'Gulp Automation',
        command: 'npm',
        args: ['run', 'gulp'],
        color: '\x1b[33m' // Yellow
      },
      {
        name: 'Git Auto-commits',
        command: 'npm',
        args: ['run', 'git:watch'],
        color: '\x1b[32m' // Green
      }
    ];

    for (const processConfig of processes) {
      await this.spawnProcess(processConfig);
    }
    
    console.log('✅ Все процессы разработки запущены');
  }

  async spawnProcess(config) {
    return new Promise((resolve) => {
      const childProcess = spawn(config.command, config.args, {
        stdio: 'pipe',
        shell: true,
        env: { ...process.env }
      });

      childProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`${config.color}[${config.name}]\x1b[0m ${output}`);
        }
      });

      childProcess.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output && !output.includes('ExperimentalWarning')) {
          console.log(`${config.color}[${config.name}]\x1b[0m ⚠️ ${output}`);
        }
      });

      childProcess.on('close', (code) => {
        console.log(`${config.color}[${config.name}]\x1b[0m завершён с кодом ${code}`);
      });

      this.processes.push({
        name: config.name,
        process: childProcess
      });

      // Даём процессу время на запуск
      setTimeout(resolve, 1000);
    });
  }

  setupSignalHandlers() {
    // Обработка Ctrl+C
    process.on('SIGINT', async () => {
      console.log('\n🛑 Получен сигнал остановки...');
      await this.cleanup();
      process.exit(0);
    });

    // Обработка закрытия терминала
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Завершение работы...');
      await this.cleanup();
      process.exit(0);
    });

    // Обработка ошибок
    process.on('uncaughtException', async (error) => {
      console.error('💥 Критическая ошибка:', error.message);
      await this.cleanup();
      process.exit(1);
    });
  }

  async cleanup() {
    if (!this.isRunning) return;
    
    console.log('\n🧹 Очистка ресурсов...');
    
    try {
      // Останавливаем автоочистку памяти
      await memoryCleaner.stopAutoCleanup();
      
      // Завершаем все процессы
      for (const processInfo of this.processes) {
        try {
          console.log(`🛑 Остановка ${processInfo.name}...`);
          processInfo.process.kill('SIGTERM');
        } catch (error) {
          console.warn(`⚠️ Ошибка остановки ${processInfo.name}:`, error.message);
        }
      }
      
      // Финальная очистка памяти
      await memoryCleaner.cleanMemory();
      
      console.log('✅ Очистка завершена');
      
    } catch (error) {
      console.error('❌ Ошибка очистки:', error.message);
    }
    
    this.isRunning = false;
  }

  async showStatus() {
    console.log('\n📊 СТАТУС РАЗРАБОТКИ:');
    console.log('======================');
    
    console.log(`🔄 Статус: ${this.isRunning ? '🟢 Активна' : '🔴 Остановлена'}`);
    console.log(`📈 Процессов: ${this.processes.length}`);
    
    for (const processInfo of this.processes) {
      const status = processInfo.process.killed ? '🔴' : '🟢';
      console.log(`  ${status} ${processInfo.name}`);
    }
    
    // Показываем статистику памяти
    await memoryCleaner.showStats();
  }
}

// CLI запуск
const optimizedDev = new OptimizedDev();

if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      optimizedDev.start();
      break;
      
    case 'status':
      optimizedDev.showStatus();
      break;
      
    default:
      console.log(`
⚡ OPTIMIZED DEVELOPMENT MODE
=============================

Команды:
  start     Запустить оптимизированную разработку
  status    Показать статус процессов

Пример:
  node scripts/dev-optimized.js start
      `);
  }
} else {
  // Запуск по умолчанию
  optimizedDev.start();
}

export default optimizedDev; 