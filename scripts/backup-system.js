// Automatic Backup System
import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';

class BackupSystem {
  constructor() {
    this.backupDir = 'backups';
    this.maxBackups = 10;
    this.criticalFiles = [
      'gulpfile.mjs',
      'vite.config.js',
      'package.json',
      'src/scss/main.scss',
      'src/scss/variables.scss',
      'src/scss/mixins.scss',
      'src/js/main.js',
      'front-page.php',
      'functions.php',
      'style.css'
    ];
  }

  async init() {
    await fs.ensureDir(this.backupDir);
    console.log('💾 Система бэкапов инициализирована');
  }

  async createBackup(type = 'manual') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${type}-${timestamp}.zip`;
    const backupPath = path.join(this.backupDir, backupName);

    try {
      await this.createZipBackup(backupPath);
      await this.cleanOldBackups();
      
      console.log(`✅ Бэкап создан: ${backupName}`);
      return backupPath;
    } catch (error) {
      console.error('❌ Ошибка создания бэкапа:', error.message);
      throw error;
    }
  }

  async createZipBackup(backupPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(backupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        const sizeKB = Math.round(archive.pointer() / 1024);
        console.log(`📦 Архив создан: ${sizeKB}KB`);
        resolve();
      });

      archive.on('error', reject);
      archive.pipe(output);

      // Добавляем критические файлы
      this.criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
          archive.file(file, { name: file });
        }
      });

      // Добавляем папки целиком
      const dirsToBackup = [
        'src/scss',
        'src/js', 
        'template-parts',
        'scripts'
      ];

      dirsToBackup.forEach(dir => {
        if (fs.existsSync(dir)) {
          archive.directory(dir, dir);
        }
      });

      archive.finalize();
    });
  }

  async cleanOldBackups() {
    const backups = await fs.readdir(this.backupDir);
    const backupFiles = backups
      .filter(file => file.startsWith('backup-') && file.endsWith('.zip'))
      .map(file => ({
        name: file,
        path: path.join(this.backupDir, file),
        time: fs.statSync(path.join(this.backupDir, file)).mtime
      }))
      .sort((a, b) => b.time - a.time);

    if (backupFiles.length > this.maxBackups) {
      const toDelete = backupFiles.slice(this.maxBackups);
      
      for (const backup of toDelete) {
        await fs.remove(backup.path);
        console.log(`🗑️ Удалён старый бэкап: ${backup.name}`);
      }
    }
  }

  async restoreBackup(backupName) {
    const backupPath = path.join(this.backupDir, backupName);
    
    if (!await fs.pathExists(backupPath)) {
      throw new Error(`Бэкап не найден: ${backupName}`);
    }

    // Создаём бэкап текущего состояния перед восстановлением
    await this.createBackup('pre-restore');
    
    console.log(`🔄 Восстановление из бэкапа: ${backupName}`);
    console.log('⚠️ Функция восстановления требует ручной реализации для безопасности');
    
    return backupPath;
  }

  async listBackups() {
    const backups = await fs.readdir(this.backupDir);
    const backupFiles = backups
      .filter(file => file.startsWith('backup-') && file.endsWith('.zip'))
      .map(file => {
        const stats = fs.statSync(path.join(this.backupDir, file));
        return {
          name: file,
          size: Math.round(stats.size / 1024) + 'KB',
          date: stats.mtime.toLocaleString('ru-RU')
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log('\n📋 СПИСОК БЭКАПОВ:');
    console.log('==================');
    
    if (backupFiles.length === 0) {
      console.log('Бэкапы не найдены');
      return [];
    }

    backupFiles.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.name}`);
      console.log(`   Размер: ${backup.size}, Дата: ${backup.date}`);
    });

    return backupFiles;
  }

  // Автоматический бэкап при важных изменениях
  async watchForChanges() {
    const chokidar = await import('chokidar');
    
    const watcher = chokidar.watch(this.criticalFiles, {
      persistent: true,
      ignoreInitial: true
    });

    let lastBackup = 0;
    const backupInterval = 30 * 60 * 1000; // 30 минут

    watcher.on('change', async (filePath) => {
      const now = Date.now();
      
      if (now - lastBackup > backupInterval) {
        console.log(`🔄 Автобэкап по изменению: ${path.basename(filePath)}`);
        await this.createBackup('auto');
        lastBackup = now;
      }
    });

    console.log('👀 Автоматический бэкап активирован');
  }

  // Экспорт настроек
  async exportSettings() {
    const settings = {
      viteConfig: await this.readFileIfExists('vite.config.js'),
      gulpConfig: await this.readFileIfExists('gulpfile.mjs'),
      packageJson: await this.readFileIfExists('package.json'),
      scssVariables: await this.readFileIfExists('src/scss/variables.scss'),
      scssMixins: await this.readFileIfExists('src/scss/mixins.scss')
    };

    const settingsPath = path.join(this.backupDir, 'settings-export.json');
    await fs.writeJSON(settingsPath, settings, { spaces: 2 });
    
    console.log('⚙️ Настройки экспортированы в settings-export.json');
    return settingsPath;
  }

  async readFileIfExists(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return null;
    }
  }
}

// Создаём экземпляр
const backupSystem = new BackupSystem();

// CLI команды
if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case '--create':
      backupSystem.init().then(() => backupSystem.createBackup('manual'));
      break;
    case '--list':
      backupSystem.init().then(() => backupSystem.listBackups());
      break;
    case '--export':
      backupSystem.init().then(() => backupSystem.exportSettings());
      break;
    case '--watch':
      backupSystem.init().then(() => backupSystem.watchForChanges());
      break;
    default:
      console.log(`
🔧 КОМАНДЫ СИСТЕМЫ БЭКАПОВ:
  --create  Создать ручной бэкап
  --list    Показать список бэкапов
  --export  Экспортировать настройки
  --watch   Включить автоматический бэкап
      `);
  }
}

export default backupSystem; 