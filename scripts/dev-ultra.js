// Dev Ultra - Максимально быстрая автоматизация разработки
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

class DevUltra {
  constructor() {
    this.processes = [];
    this.isRunning = false;
    this.githubUsername = 'FrontSites';
    this.projectName = this.getProjectName();
  }

  getProjectName() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (packageJson.name && packageJson.name !== 'template') {
        return packageJson.name;
      }
    } catch {}
    
    try {
      const currentDir = process.cwd();
      const folderName = path.basename(currentDir);
      const cleanName = folderName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
      
      return cleanName || 'wordpress-theme';
    } catch {
      return 'wordpress-theme';
    }
  }

  async start() {
    console.log(`
🚀 DEV ULTRA - МАКСИМАЛЬНО БЫСТРАЯ АВТОМАТИЗАЦИЯ
===============================================

🎯 Цель: Мгновенная компиляция + автоматический Git
📦 Проект: ${this.projectName}
👤 GitHub: ${this.githubUsername}
⚡ Скорость: МАКСИМАЛЬНАЯ
    `);

    try {
      // 1. Проверяем и инициализируем Git
      await this.setupGit();
      
      // 2. Максимальная оптимизация системы
      await this.maximizePerformance();
      
      // 3. Запускаем только необходимые процессы
      await this.startOptimizedProcesses();
      
      // 4. Настраиваем обработчики
      this.setupSignalHandlers();
      
      this.isRunning = true;
      console.log('\n✅ DEV ULTRA запущен с максимальной скоростью!');
      console.log('🌐 GitHub: https://github.com/' + this.githubUsername + '/' + this.projectName);
      console.log('⚡ Компиляция: МГНОВЕННАЯ');
      console.log('💡 Для остановки нажмите Ctrl+C');
      
    } catch (error) {
      console.error('❌ Ошибка запуска DEV ULTRA:', error.message);
      await this.cleanup();
    }
  }

  async setupGit() {
    console.log('🔧 Быстрая настройка Git...');
    
    try {
      // Проверяем статус Git
      await execAsync('git status');
      console.log('✅ Git репозиторий найден');
      
      // Проверяем remote
      try {
        const { stdout: remote } = await execAsync('git remote -v');
        if (remote.includes('github.com')) {
          console.log('✅ GitHub remote настроен');
          return;
        }
      } catch {}
      
      // Создаём GitHub репозиторий
      await this.createGitHubRepo();
      
    } catch (error) {
      console.log('📁 Git репозиторий не найден, инициализируем...');
      
      // Удаляем повреждённый .git если есть
      try {
        await fs.remove('.git');
        console.log('🗑️ Удалён повреждённый .git');
      } catch {}
      
      await this.initializeGitRepo();
      await this.createGitHubRepo();
    }
  }

  async initializeGitRepo() {
    try {
      await execAsync('git init');
      await execAsync('git branch -M main');
      
      // Создаём .gitignore
      await this.createGitignore();
      
      // Первый коммит
      await execAsync('git add .');
      await execAsync('git commit -m "🎉 Initial commit - DEV ULTRA MAX SPEED"');
      
      console.log('✅ Git репозиторий инициализирован');
      
    } catch (error) {
      throw new Error('Ошибка инициализации Git: ' + error.message);
    }
  }

  async createGitignore() {
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
/public/build/
*.tgz
*.tar.gz

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# WordPress specific
wp-config.php
wp-content/uploads/
wp-content/cache/
wp-content/backup-db/
wp-content/advanced-cache.php
wp-content/wp-cache-config.php

# Project specific
performance.log
notifications.log
backups/
*.bak
.git-version

# Temporary files
*.tmp
*.temp
.cache/
`;

    await fs.writeFile('.gitignore', gitignoreContent);
    console.log('✅ .gitignore создан');
  }

  async createGitHubRepo() {
    try {
      console.log('🌐 Создание репозитория на GitHub...');
      
      // Используем GitHub CLI если доступен
      try {
        await execAsync('gh --version');
        
        const createCommand = `gh repo create ${this.githubUsername}/${this.projectName} --public --description "WordPress Theme Development System with DEV ULTRA MAX SPEED" --clone=false`;
        await execAsync(createCommand);
        
        console.log(`✅ Репозиторий создан: https://github.com/${this.githubUsername}/${this.projectName}`);
        
        // Добавляем remote origin
        const remoteUrl = `https://github.com/${this.githubUsername}/${this.projectName}.git`;
        await execAsync(`git remote add origin ${remoteUrl}`);
        
        // Пушим первый коммит
        await execAsync('git push -u origin main');
        
        console.log('🚀 Код загружен на GitHub!');
        
      } catch (ghError) {
        console.log('⚠️ GitHub CLI не найден. Создайте репозиторий вручную:');
        console.log(`1. Перейдите на https://github.com/new`);
        console.log(`2. Название: ${this.projectName}`);
        console.log(`3. Описание: WordPress Theme Development System`);
        console.log(`4. Сделайте публичным`);
        console.log(`5. Выполните команды:`);
        console.log(`   git remote add origin https://github.com/${this.githubUsername}/${this.projectName}.git`);
        console.log(`   git push -u origin main`);
      }
      
    } catch (error) {
      console.error('❌ Ошибка создания GitHub репозитория:', error.message);
    }
  }

  async maximizePerformance() {
    console.log('⚡ Максимальная оптимизация системы...');
    
    // Устанавливаем переменные окружения для максимальной производительности
    process.env.NODE_OPTIONS = '--max-old-space-size=8192 --expose-gc --optimize-for-size';
    process.env.VITE_NODE_OPTIONS = '--max-old-space-size=8192';
    process.env.UV_THREADPOOL_SIZE = '256';
    process.env.GULP_OPTIMIZE = 'true';
    process.env.SASS_OPTIMIZE = 'true';
    
    // Отключаем source maps для скорости
    process.env.GENERATE_SOURCEMAP = 'false';
    process.env.VITE_SOURCEMAP = 'false';
    
    console.log('✅ Система оптимизирована для максимальной скорости');
  }

  async startOptimizedProcesses() {
    console.log('🚀 Запуск оптимизированных процессов...');
    
    // Запускаем только самые необходимые процессы для максимальной скорости
    const processes = [
      {
        name: 'Vite Dev Server',
        command: 'npm',
        args: ['run', 'vite-only'],
        color: '\x1b[36m' // Cyan
      },
      {
        name: 'Gulp MAX SPEED',
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
    
    console.log('✅ Оптимизированные процессы запущены');
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
      setTimeout(resolve, 500); // Уменьшили время ожидания
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
    
    console.log('\n🧹 Быстрая очистка ресурсов...');
    
    try {
      // Завершаем все процессы
      for (const processInfo of this.processes) {
        try {
          console.log(`🛑 Остановка ${processInfo.name}...`);
          processInfo.process.kill('SIGTERM');
        } catch (error) {
          console.warn(`⚠️ Ошибка остановки ${processInfo.name}:`, error.message);
        }
      }
      
      console.log('✅ Очистка завершена');
      
    } catch (error) {
      console.error('❌ Ошибка очистки:', error.message);
    }
    
    this.isRunning = false;
  }

  async showStatus() {
    console.log('\n📊 СТАТУС DEV ULTRA MAX SPEED:');
    console.log('==============================');
    
    console.log(`🔄 Статус: ${this.isRunning ? '🟢 Активен' : '🔴 Остановлен'}`);
    console.log(`📈 Процессов: ${this.processes.length}`);
    console.log(`📦 Проект: ${this.projectName}`);
    console.log(`⚡ Скорость: МАКСИМАЛЬНАЯ`);
    console.log(`🌐 GitHub: https://github.com/${this.githubUsername}/${this.projectName}`);
    
    for (const processInfo of this.processes) {
      const status = processInfo.process.killed ? '🔴' : '🟢';
      console.log(`  ${status} ${processInfo.name}`);
    }
  }
}

// CLI запуск
const devUltra = new DevUltra();

if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      devUltra.start();
      break;
      
    case 'status':
      devUltra.showStatus();
      break;
      
    default:
      console.log(`
🚀 DEV ULTRA - МАКСИМАЛЬНО БЫСТРАЯ АВТОМАТИЗАЦИЯ
===============================================

Команды:
  start     Запустить DEV ULTRA MAX SPEED
  status    Показать статус процессов

Пример:
  node scripts/dev-ultra.js start
  npm run dev-ultra
      `);
  }
} else {
  // Запуск по умолчанию
  devUltra.start();
}

export default devUltra; 