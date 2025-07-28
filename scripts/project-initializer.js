// Project Initializer with Git Integration
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';

const execAsync = promisify(exec);

class ProjectInitializer {
  constructor() {
    this.projectConfig = {
      name: this.getProjectNameFromFolder(),
      description: '',
      githubUsername: 'FrontSites',
      gitEnabled: true,
      autoCommit: true
    };
  }

  getProjectNameFromFolder() {
    try {
      const currentDir = process.cwd();
      const folderName = path.basename(currentDir);
      
      // Очищаем название от специальных символов для GitHub
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
    console.log(`
🚀 ИНИЦИАЛИЗАЦИЯ НОВОГО ПРОЕКТА
================================

Создаём новый WordPress Theme проект с полной автоматизацией!
    `);

    await this.collectProjectInfo();
    await this.setupProject();
    await this.initializeGit();
    await this.showFinalInstructions();
  }

  async collectProjectInfo() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => {
      rl.question(prompt, resolve);
    });

    try {
      console.log('📝 Настройка проекта:\n');
      
      this.projectConfig.name = await question(`Название проекта (${this.projectConfig.name}): `) || this.projectConfig.name;
      this.projectConfig.description = await question('Описание проекта: ') || 'WordPress Theme with Vite + Gulp automation';
      
      const gitChoice = await question('Создать Git репозиторий? (y/n): ');
      this.projectConfig.gitEnabled = gitChoice.toLowerCase() === 'y' || gitChoice === '';
      
      if (this.projectConfig.gitEnabled) {
        const autoChoice = await question('Включить автоматические коммиты? (y/n): ');
        this.projectConfig.autoCommit = autoChoice.toLowerCase() === 'y' || autoChoice === '';
      }

    } finally {
      rl.close();
    }
  }

  async setupProject() {
    console.log('\n🔧 Настройка проекта...');
    
    // Обновляем package.json
    await this.updatePackageJson();
    
    // Создаём базовые файлы
    await this.createProjectFiles();
    
    // Устанавливаем права доступа
    await this.setupPermissions();
    
    console.log('✅ Проект настроен');
  }

  async updatePackageJson() {
    try {
      const packagePath = 'package.json';
      const packageData = await fs.readJSON(packagePath);
      
      packageData.name = this.projectConfig.name;
      packageData.description = this.projectConfig.description;
      packageData.version = '1.0.0';
      
      await fs.writeJSON(packagePath, packageData, { spaces: 2 });
      console.log('📦 package.json обновлён');
      
    } catch (error) {
      console.warn('⚠️ Не удалось обновить package.json:', error.message);
    }
  }

  async createProjectFiles() {
    // Создаём README для проекта
    const readmeContent = `# ${this.projectConfig.name}

${this.projectConfig.description}

## 🚀 Быстрый старт

\`\`\`bash
# 1. Установка зависимостей
npm install

# 2. Настройка прав доступа
npm run setup-permissions

# 3. Запуск разработки
npm run dev
\`\`\`

## 📦 Основные команды

\`\`\`bash
npm run dev                 # Основная разработка
npm run dev-git            # Разработка + автоматические коммиты
npm run build              # Сборка для продакшена
npm run git:status         # Статус Git
\`\`\`

## 🌐 GitHub

Репозиторий: https://github.com/${this.projectConfig.githubUsername}/${this.projectConfig.name}

---

**Создано с помощью WordPress Theme Development System v2.0** 🚀
`;

    await fs.writeFile('README.md', readmeContent);
    console.log('📝 README.md создан');

    // Настройки сохраняются в .devconfig.json
    console.log('⚙️ Настройки сохранены в .devconfig.json');
  }

  async setupPermissions() {
    try {
      console.log('🛡️ Настройка прав доступа...');
      await execAsync('npm run setup-permissions');
      console.log('✅ Права доступа настроены');
    } catch (error) {
      console.warn('⚠️ Не удалось настроить права доступа:', error.message);
    }
  }

  async initializeGit() {
    if (!this.projectConfig.gitEnabled) {
      console.log('⏭️ Git инициализация пропущена');
      return;
    }

    try {
      console.log('\n🌐 Инициализация Git...');
      
      // Инициализируем Git
      await execAsync('git init');
      await execAsync('git branch -M main');
      
      // Создаём .gitignore
      await this.createGitignore();
      
      // Первый коммит
      await execAsync('git add .');
      await execAsync(`git commit -m "🎉 Initial commit - ${this.projectConfig.name}"`);
      
      console.log('✅ Git репозиторий инициализирован');
      
      // Пытаемся создать GitHub репозиторий
      await this.createGitHubRepo();
      
    } catch (error) {
      console.error('❌ Ошибка инициализации Git:', error.message);
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

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Runtime data
pids
*.pid
*.seed
*.pid.lock

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
    console.log('📝 .gitignore создан');
  }

  async createGitHubRepo() {
    try {
      console.log('🌐 Создание GitHub репозитория...');
      
      // Проверяем GitHub CLI
      try {
        await execAsync('gh --version');
        
        const createCommand = `gh repo create ${this.projectConfig.githubUsername}/${this.projectConfig.name} --public --description "${this.projectConfig.description}" --clone=false`;
        await execAsync(createCommand);
        
        console.log(`✅ GitHub репозиторий создан: https://github.com/${this.projectConfig.githubUsername}/${this.projectConfig.name}`);
        
        // Добавляем remote и пушим
        const remoteUrl = `https://github.com/${this.projectConfig.githubUsername}/${this.projectConfig.name}.git`;
        await execAsync(`git remote add origin ${remoteUrl}`);
        await execAsync('git push -u origin main');
        
        console.log('🚀 Код загружен на GitHub!');
        
      } catch (ghError) {
        console.log('\n⚠️ GitHub CLI не найден или ошибка создания репозитория');
        console.log('📋 Создайте репозиторий вручную:');
        console.log(`1. Перейдите на https://github.com/new`);
        console.log(`2. Название: ${this.projectConfig.name}`);
        console.log(`3. Описание: ${this.projectConfig.description}`);
        console.log(`4. Сделайте публичным и создайте`);
        console.log(`5. Выполните команды:`);
        console.log(`   git remote add origin https://github.com/${this.projectConfig.githubUsername}/${this.projectConfig.name}.git`);
        console.log(`   git push -u origin main`);
      }
      
    } catch (error) {
      console.warn('⚠️ Не удалось создать GitHub репозиторий:', error.message);
    }
  }

  async showFinalInstructions() {
    console.log(`
🎉 ПРОЕКТ УСПЕШНО СОЗДАН!
=========================

📁 Проект: ${this.projectConfig.name}
📝 Описание: ${this.projectConfig.description}
🌐 GitHub: https://github.com/${this.projectConfig.githubUsername}/${this.projectConfig.name}

🚀 СЛЕДУЮЩИЕ ШАГИ:

1. Запустите разработку:
   ${this.projectConfig.autoCommit ? 'npm run dev-git' : 'npm run dev'}

2. Основные команды:
   npm run dev                 # Разработка
   npm run build              # Сборка
   npm run git:status         # Статус Git
   ${this.projectConfig.autoCommit ? 'npm run git:watch          # Автоматические коммиты' : ''}

3. Документация:
   docs/MAIN-DOCS.md          # Полная документация

${this.projectConfig.autoCommit ? `
🤖 АВТОМАТИЧЕСКИЕ КОММИТЫ ВКЛЮЧЕНЫ:
- Изменения коммитятся автоматически каждые 10 секунд
- Версии: v1, v2, v3...
- Автоматический push на GitHub
` : ''}

💡 Совет: Используйте npm run dev-git для разработки с автоматическими коммитами!

**Удачной разработки!** 🚀
    `);
  }
}

// CLI запуск
const initializer = new ProjectInitializer();

if (process.argv[2] === 'init') {
  initializer.init().catch(console.error);
} else {
  console.log(`
🚀 PROJECT INITIALIZER
======================

Команда:
  node scripts/project-initializer.js init

Или используйте:
  npm run project:init
  `);
}

export default initializer; 