// Git Automation System
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';

const execAsync = promisify(exec);

class GitAutomation {
  constructor() {
    this.isGitRepo = false;
    this.version = 1;
    this.lastCommitTime = 0;
    this.commitDelay = 10000; // 10 секунд между коммитами
    this.watchFiles = [
      'src/**/*',
      'gulpfile.mjs',
      'vite.config.js',
      'package.json',
      '*.php',
      'template-parts/**/*'
    ];
    this.githubUsername = 'FrontSites';
    this.projectName = this.getProjectName();
    this.isProcessing = false;
    this.watcher = null;
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

  async init() {
    console.log('🌐 Git Automation System инициализирован');
    await this.checkGitStatus();
    await this.loadVersion();
  }

  async checkGitStatus() {
    try {
      await execAsync('git status');
      this.isGitRepo = true;
      console.log('✅ Git репозиторий найден');
    } catch {
      this.isGitRepo = false;
      console.log('📁 Git репозиторий не найден');
    }
  }

  async loadVersion() {
    try {
      const versionFile = '.git-version';
      if (await fs.pathExists(versionFile)) {
        const version = await fs.readFile(versionFile, 'utf8');
        this.version = parseInt(version.trim()) || 1;
      }
      console.log(`📊 Текущая версия: v${this.version}`);
    } catch {
      this.version = 1;
    }
  }

  async saveVersion() {
    try {
      await fs.writeFile('.git-version', this.version.toString());
    } catch (error) {
      console.warn('⚠️ Не удалось сохранить версию:', error.message);
    }
  }

  async initializeGitRepo() {
    if (this.isGitRepo) {
      console.log('✅ Git репозиторий уже существует');
      return;
    }

    try {
      console.log('🚀 Инициализация Git репозитория...');
      
      await execAsync('git init');
      await execAsync('git branch -M main');
      await this.createGitignore();
      
      await execAsync('git add .');
      await execAsync('git commit -m "🎉 Initial commit - WordPress Theme Development System v2.0"');
      
      this.isGitRepo = true;
      console.log('✅ Git репозиторий инициализирован');
      
    } catch (error) {
      console.error('❌ Ошибка инициализации Git:', error.message);
      throw error;
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
      
      try {
        await execAsync('gh --version');
        
        const createCommand = `gh repo create ${this.githubUsername}/${this.projectName} --public --description "WordPress Theme Development System with Vite + Gulp automation" --clone=false`;
        await execAsync(createCommand);
        
        console.log(`✅ Репозиторий создан: https://github.com/${this.githubUsername}/${this.projectName}`);
        
        const remoteUrl = `https://github.com/${this.githubUsername}/${this.projectName}.git`;
        await execAsync(`git remote add origin ${remoteUrl}`);
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

  async forceCompile() {
    console.log('⚙️ Принудительная компиляция...');
    try {
      // Останавливаем все процессы Gulp
      await execAsync('taskkill /f /im node.exe').catch(() => {});
      
      // Ждём секунду
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Запускаем компиляцию
      await execAsync('npm run scss');
      await execAsync('npm run js');
      
      console.log('✅ Принудительная компиляция завершена');
      return true;
    } catch (error) {
      console.error('❌ Ошибка принудительной компиляции:', error.message);
      return false;
    }
  }

  async autoCommit(changedFiles = []) {
    if (!this.isGitRepo) {
      console.log('⚠️ Git репозиторий не инициализирован');
      return;
    }

    if (this.isProcessing) {
      console.log('⏳ Уже обрабатывается предыдущий коммит...');
      return;
    }

    const now = Date.now();
    if (now - this.lastCommitTime < this.commitDelay) {
      console.log('⏳ Ожидание перед следующим коммитом...');
      return;
    }

    this.isProcessing = true;

    try {
      // Проверяем есть ли изменения
      const { stdout: status } = await execAsync('git status --porcelain');
      if (!status.trim()) {
        console.log('📝 Нет изменений для коммита');
        this.isProcessing = false;
        return;
      }

      console.log(`🔄 Подготовка к автокоммиту v${this.version}...`);
      
      // ПРИНУДИТЕЛЬНО КОМПИЛИРУЕМ
      const compileSuccess = await this.forceCompile();
      
      if (!compileSuccess) {
        console.log('⚠️ Компиляция не удалась, пропускаем коммит');
        this.isProcessing = false;
        return;
      }
      
      // Проверяем что скомпилированные файлы существуют
      const cssExists = await fs.pathExists('assets/css/main.min.css');
      const jsExists = await fs.pathExists('assets/js/main.min.js');
      
      if (!cssExists || !jsExists) {
        console.log('⚠️ Скомпилированные файлы не найдены, пропускаем коммит');
        this.isProcessing = false;
        return;
      }
      
      console.log('✅ Скомпилированные файлы найдены');
      
      // ДЕЛАЕМ КОММИТ
      console.log(`📝 Создание коммита v${this.version}...`);
      
      await execAsync('git add .');
      
      const commitMessage = this.generateCommitMessage(changedFiles);
      await execAsync(`git commit -m "${commitMessage}"`);
      
      // Пушим если есть remote
      try {
        await execAsync('git push');
        console.log('🚀 Изменения загружены на GitHub');
      } catch (pushError) {
        console.log('⚠️ Не удалось загрузить на GitHub (возможно нет remote)');
      }
      
      // Увеличиваем версию и сохраняем
      this.version++;
      await this.saveVersion();
      this.lastCommitTime = now;
      
      console.log(`✅ Автокоммит v${this.version - 1} выполнен`);
      
    } catch (error) {
      console.error('❌ Ошибка автокоммита:', error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  generateCommitMessage(changedFiles) {
    const fileTypes = this.analyzeChangedFiles(changedFiles);
    
    let message = `🚀 Auto Commit v${this.version}`;
    
    if (fileTypes.length > 0) {
      message += ` - ${fileTypes.join(', ')}`;
    }
    
    const timestamp = new Date().toLocaleString('ru-RU');
    message += ` (${timestamp})`;
    
    return message;
  }

  analyzeChangedFiles(changedFiles) {
    const types = [];
    
    if (changedFiles.some(f => f.includes('.scss'))) types.push('📝 SCSS');
    if (changedFiles.some(f => f.includes('.js'))) types.push('📜 JS');
    if (changedFiles.some(f => f.includes('.php'))) types.push('🐘 PHP');
    if (changedFiles.some(f => f.includes('package.json'))) types.push('📦 Dependencies');
    if (changedFiles.some(f => f.includes('gulpfile') || f.includes('vite.config'))) types.push('⚙️ Config');
    if (changedFiles.some(f => f.includes('.md'))) types.push('📚 Docs');
    
    return types;
  }

  async startWatching() {
    if (!this.isGitRepo) {
      console.log('⚠️ Git не инициализирован. Запустите git:init сначала');
      return;
    }

    console.log('👀 Запуск автоматического отслеживания изменений...');
    console.log('💡 Система будет принудительно компилировать файлы перед каждым коммитом');
    
    this.watcher = chokidar.watch(this.watchFiles, {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/backups/**',
        '**/*.log',
        '**/*.bak',
        '**/assets/css/*.min.css',
        '**/assets/js/*.min.js',
        '**/*.min.css',
        '**/*.min.js'
      ],
      persistent: true,
      ignoreInitial: true
    });

    let changedFiles = [];
    let timeoutId = null;

    const processChanges = async () => {
      if (changedFiles.length > 0) {
        console.log(`📁 Изменения обнаружены: ${changedFiles.length} файлов`);
        await this.autoCommit([...changedFiles]);
        changedFiles = [];
      }
    };

    this.watcher.on('change', (filePath) => {
      changedFiles.push(filePath);
      console.log(`📝 Изменён: ${path.basename(filePath)}`);
      
      // Дебаунсинг - ждём 3 секунды после последнего изменения
      clearTimeout(timeoutId);
      timeoutId = setTimeout(processChanges, 3000);
    });

    this.watcher.on('add', (filePath) => {
      changedFiles.push(filePath);
      console.log(`➕ Добавлен: ${path.basename(filePath)}`);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(processChanges, 3000);
    });

    this.watcher.on('unlink', (filePath) => {
      changedFiles.push(filePath);
      console.log(`🗑️ Удалён: ${path.basename(filePath)}`);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(processChanges, 3000);
    });

    console.log('✅ Автоматическое отслеживание активировано');
    console.log('💡 Изменения будут коммититься автоматически через 3 секунды после последнего изменения');
  }

  async manualCommit(message = null) {
    if (!this.isGitRepo) {
      console.log('⚠️ Git репозиторий не инициализирован');
      return;
    }

    if (this.isProcessing) {
      console.log('⏳ Уже обрабатывается предыдущий коммит...');
      return;
    }

    this.isProcessing = true;

    try {
      console.log('🔄 Подготовка к ручному коммиту...');
      
      // ПРИНУДИТЕЛЬНО КОМПИЛИРУЕМ
      const compileSuccess = await this.forceCompile();
      
      if (!compileSuccess) {
        console.log('⚠️ Компиляция не удалась, пропускаем коммит');
        this.isProcessing = false;
        return;
      }
      
      // Проверяем что скомпилированные файлы существуют
      const cssExists = await fs.pathExists('assets/css/main.min.css');
      const jsExists = await fs.pathExists('assets/js/main.min.js');
      
      if (!cssExists || !jsExists) {
        console.log('⚠️ Скомпилированные файлы не найдены, пропускаем коммит');
        this.isProcessing = false;
        return;
      }
      
      console.log('✅ Скомпилированные файлы найдены');
      
      const commitMessage = message || `🔄 Manual commit v${this.version}`;
      
      console.log('📝 Создание коммита...');
      await execAsync('git add .');
      await execAsync(`git commit -m "${commitMessage}"`);
      
      try {
        await execAsync('git push');
        console.log('🚀 Изменения загружены на GitHub');
      } catch {
        console.log('⚠️ Не удалось загрузить на GitHub');
      }
      
      this.version++;
      await this.saveVersion();
      
      console.log(`✅ Ручной коммит v${this.version - 1} выполнен`);
      
    } catch (error) {
      console.error('❌ Ошибка ручного коммита:', error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  async getStatus() {
    if (!this.isGitRepo) {
      console.log('❌ Git репозиторий не инициализирован');
      return;
    }

    try {
      const { stdout: status } = await execAsync('git status --porcelain');
      const { stdout: branch } = await execAsync('git branch --show-current');
      const { stdout: remote } = await execAsync('git remote -v').catch(() => ({ stdout: 'Нет remote' }));
      
      console.log('\n📊 GIT СТАТУС:');
      console.log('================');
      console.log(`Ветка: ${branch.trim()}`);
      console.log(`Версия: v${this.version}`);
      console.log(`Проект: ${this.projectName}`);
      console.log(`Обработка: ${this.isProcessing ? 'Да' : 'Нет'}`);
      console.log(`Отслеживание: ${this.watcher ? 'Активно' : 'Неактивно'}`);
      
      if (status.trim()) {
        console.log('\n📝 Неcохранённые изменения:');
        console.log(status);
      } else {
        console.log('\n✅ Все изменения сохранены');
      }
      
      if (remote.includes('github.com')) {
        console.log(`\n🌐 GitHub: https://github.com/${this.githubUsername}/${this.projectName}`);
      }
      
    } catch (error) {
      console.error('❌ Ошибка получения статуса:', error.message);
    }
  }

  async stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    console.log('🛑 Автоматическое отслеживание остановлено');
  }
}

// Создаём экземпляр
const gitAuto = new GitAutomation();

// CLI команды
if (process.argv[2]) {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  switch (command) {
    case 'init':
      gitAuto.init().then(async () => {
        await gitAuto.initializeGitRepo();
        await gitAuto.createGitHubRepo();
      });
      break;
      
    case 'watch':
      gitAuto.init().then(() => gitAuto.startWatching());
      break;
      
    case 'commit':
      gitAuto.init().then(() => gitAuto.manualCommit(arg));
      break;
      
    case 'status':
      gitAuto.init().then(() => gitAuto.getStatus());
      break;
      
    case 'push':
      gitAuto.init().then(async () => {
        await gitAuto.autoCommit();
      });
      break;
      
    case 'stop':
      gitAuto.stopWatching();
      break;
      
    default:
      console.log(`
🌐 GIT AUTOMATION SYSTEM
========================

Команды:
  init     Инициализировать Git и создать GitHub репозиторий
  watch    Запустить автоматическое отслеживание изменений
  commit   Сделать ручной коммит (опционально с сообщением)
  status   Показать статус Git
  push     Принудительно сделать коммит и push
  stop     Остановить автоматическое отслеживание

Примеры:
  node scripts/git-automation.js init
  node scripts/git-automation.js watch
  node scripts/git-automation.js commit "Добавил новую функцию"
  node scripts/git-automation.js status
  node scripts/git-automation.js stop
      `);
  }
}

export default gitAuto; 