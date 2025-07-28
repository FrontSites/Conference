// New Project Setup - Complete initialization with GitHub
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';

const execAsync = promisify(exec);

class NewProjectSetup {
  constructor() {
    this.projectName = this.getProjectNameFromFolder();
    this.githubUsername = 'FrontSites';
    this.description = 'WordPress Theme Development System with Vite + Gulp automation';
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

📁 Проект: ${this.projectName}
👤 GitHub: @${this.githubUsername}
📝 Описание: ${this.description}
    `);

    try {
      // 1. Проверяем GitHub CLI
      await this.checkGitHubCLI();
      
      // 2. Удаляем старый remote если есть
      await this.cleanupOldRemote();
      
      // 3. Инициализируем Git если нужно
      await this.initializeGit();
      
      // 4. Создаём .gitignore
      await this.createGitignore();
      
      // 5. Обновляем package.json
      await this.updatePackageJson();
      
      // 6. Создаём README
      await this.createReadme();
      
      // 7. Делаем первый коммит
      await this.makeInitialCommit();
      
      // 8. Создаём GitHub репозиторий
      await this.createGitHubRepository();
      
      // 9. Загружаем код на GitHub
      await this.pushToGitHub();
      
      // 10. Показываем финальную информацию
      await this.showSuccess();
      
    } catch (error) {
      console.error('❌ Ошибка инициализации:', error.message);
      process.exit(1);
    }
  }

  async checkGitHubCLI() {
    try {
      console.log('🔍 Проверка GitHub CLI...');
      await execAsync('gh auth status');
      console.log('✅ GitHub CLI авторизован');
    } catch (error) {
      console.error('❌ GitHub CLI не авторизован. Выполните: gh auth login');
      throw error;
    }
  }

  async cleanupOldRemote() {
    try {
      console.log('🧹 Очистка старых remote...');
      await execAsync('git remote remove origin').catch(() => {});
      console.log('✅ Старые remote удалены');
    } catch (error) {
      // Игнорируем ошибки - remote может не существовать
    }
  }

  async initializeGit() {
    try {
      console.log('📁 Инициализация Git...');
      
      // Проверяем есть ли уже Git
      try {
        await execAsync('git status');
        console.log('✅ Git репозиторий уже существует');
      } catch {
        // Инициализируем новый Git
        await execAsync('git init');
        await execAsync('git branch -M main');
        console.log('✅ Git репозиторий инициализирован');
      }
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

# Environment files (not used in this project)
# .env files removed - using .devconfig.json instead

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
    console.log('✅ .gitignore создан');
  }

  async updatePackageJson() {
    try {
      console.log('📦 Обновление package.json...');
      
      const packagePath = 'package.json';
      const packageData = await fs.readJSON(packagePath);
      
      packageData.name = this.projectName;
      packageData.description = this.description;
      packageData.version = '1.0.0';
      
      await fs.writeJSON(packagePath, packageData, { spaces: 2 });
      console.log('✅ package.json обновлён');
      
    } catch (error) {
      console.warn('⚠️ Не удалось обновить package.json:', error.message);
    }
  }

  async createReadme() {
    const readmeContent = `# 🚀 ${this.projectName}

${this.description}

## 🚀 Быстрый старт

\`\`\`bash
# 1. Установка зависимостей
npm install

# 2. Настройка прав доступа
npm run setup-permissions

# 3. Запуск разработки с автоматическими коммитами
npm run dev-git
\`\`\`

## 📦 Основные команды

\`\`\`bash
npm run dev                 # Основная разработка
npm run dev-git            # Разработка + автоматические коммиты
npm run build              # Сборка для продакшена
npm run git:status         # Статус Git
npm run git:watch          # Автоматические коммиты
\`\`\`

## 🌐 GitHub

Репозиторий: https://github.com/${this.githubUsername}/${this.projectName}

---

**Создано с помощью WordPress Theme Development System v2.0** 🚀
`;

    await fs.writeFile('README.md', readmeContent);
    console.log('✅ README.md создан');
  }

  async makeInitialCommit() {
    try {
      console.log('📝 Создание первого коммита...');
      
      await execAsync('git add .');
      await execAsync(`git commit -m "🎉 Initial commit - ${this.projectName}"`);
      
      console.log('✅ Первый коммит создан');
    } catch (error) {
      console.error('❌ Ошибка создания коммита:', error.message);
      throw error;
    }
  }

  async createGitHubRepository() {
    try {
      console.log('🌐 Создание GitHub репозитория...');
      
      const createCommand = `gh repo create ${this.githubUsername}/${this.projectName} --public --description "${this.description}" --clone=false`;
      await execAsync(createCommand);
      
      console.log(`✅ GitHub репозиторий создан: https://github.com/${this.githubUsername}/${this.projectName}`);
      
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ Репозиторий уже существует, используем существующий');
      } else {
        console.error('❌ Ошибка создания GitHub репозитория:', error.message);
        throw error;
      }
    }
  }

  async pushToGitHub() {
    try {
      console.log('🚀 Загрузка кода на GitHub...');
      
      // Добавляем remote origin
      const remoteUrl = `https://github.com/${this.githubUsername}/${this.projectName}.git`;
      await execAsync(`git remote add origin ${remoteUrl}`);
      
      // Пушим код
      await execAsync('git push -u origin main');
      
      console.log('✅ Код успешно загружен на GitHub!');
      
    } catch (error) {
      if (error.message.includes('already exists')) {
        // Remote уже существует, просто пушим
        await execAsync('git push -u origin main');
        console.log('✅ Код успешно загружен на GitHub!');
      } else {
        console.error('❌ Ошибка загрузки на GitHub:', error.message);
        throw error;
      }
    }
  }

  async showSuccess() {
    console.log(`
🎉 ПРОЕКТ УСПЕШНО СОЗДАН!
=========================

📁 Проект: ${this.projectName}
🌐 GitHub: https://github.com/${this.githubUsername}/${this.projectName}
📝 Описание: ${this.description}

🚀 СЛЕДУЮЩИЕ ШАГИ:

1. Запустите разработку с автоматическими коммитами:
   npm run dev-git

2. Основные команды:
   npm run dev                 # Разработка
   npm run build              # Сборка
   npm run git:status         # Статус Git
   npm run git:watch          # Автоматические коммиты

3. Документация:
   docs/MAIN-DOCS.md          # Полная документация

🤖 АВТОМАТИЧЕСКИЕ КОММИТЫ:
- Изменения коммитятся автоматически каждые 10 секунд
- Версии: v1, v2, v3...
- Автоматический push на GitHub

💡 Совет: Используйте npm run dev-git для разработки с автоматическими коммитами!

**Удачной разработки!** 🚀
    `);
  }
}

// CLI запуск
const setup = new NewProjectSetup();

if (process.argv[2] === 'init') {
  setup.init().catch(console.error);
} else {
  console.log(`
🚀 NEW PROJECT SETUP
====================

Команда:
  node scripts/new-project-setup.js init

Или используйте:
  npm run new-project
  `);
}

export default setup; 