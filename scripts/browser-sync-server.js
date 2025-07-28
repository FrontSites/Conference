// Browser-Sync Server for PHP Hot Reload
import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import path from 'path';
import { networkInterfaces } from 'os';

const bs = browserSync.create();

class BrowserSyncServer {
  constructor() {
    this.isRunning = false;
    this.config = {
      proxy: false, // Если используешь локальный сервер
      server: {
        baseDir: './',
        index: 'index.html'
      },
      files: [
        'assets/css/*.css',
        'assets/js/*.js',
        '**/*.php',
        '**/*.html'
      ],
      port: 3001,
      ui: {
        port: 3002
      },
      open: false,
      notify: false,
      ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
      },
      logLevel: 'info',
      logPrefix: '🌐 BrowserSync'
    };
  }

  async start(options = {}) {
    if (this.isRunning) {
      console.log('⚠️ Browser-Sync уже запущен');
      return;
    }

    const config = { ...this.config, ...options };
    
    try {
      await new Promise((resolve, reject) => {
        bs.init(config, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      this.isRunning = true;
      console.log('🌐 Browser-Sync запущен!');
      console.log(`📱 Local: http://localhost:${config.port}`);
      console.log(`🖥️ External: http://${this.getLocalIP()}:${config.port}`);
      console.log(`⚙️ UI: http://localhost:${config.ui.port}`);
      
      this.setupWatchers();
      
    } catch (error) {
      console.error('❌ Ошибка запуска Browser-Sync:', error.message);
    }
  }

  setupWatchers() {
    // Дополнительные watchers для специфичных файлов
    const phpWatcher = chokidar.watch(['**/*.php', '!node_modules/**'], {
      ignoreInitial: true
    });

    const cssWatcher = chokidar.watch('assets/css/**/*.css', {
      ignoreInitial: true
    });

    const jsWatcher = chokidar.watch('assets/js/**/*.js', {
      ignoreInitial: true
    });

    // PHP файлы - полная перезагрузка
    phpWatcher.on('change', (filePath) => {
      console.log(`🔄 PHP изменён: ${path.basename(filePath)}`);
      bs.reload();
    });

    // CSS - инжекция без перезагрузки
    cssWatcher.on('change', (filePath) => {
      console.log(`🎨 CSS обновлён: ${path.basename(filePath)}`);
      bs.reload('*.css');
    });

    // JS - перезагрузка
    jsWatcher.on('change', (filePath) => {
      console.log(`📜 JS обновлён: ${path.basename(filePath)}`);
      bs.reload();
    });

    console.log('👀 Watchers настроены для PHP, CSS, JS');
  }

  async stop() {
    if (!this.isRunning) {
      console.log('⚠️ Browser-Sync не запущен');
      return;
    }

    bs.exit();
    this.isRunning = false;
    console.log('🛑 Browser-Sync остановлен');
  }

  async reload(files = null) {
    if (!this.isRunning) {
      console.log('⚠️ Browser-Sync не запущен');
      return;
    }

    if (files) {
      bs.reload(files);
    } else {
      bs.reload();
    }
  }

  // Получение локального IP
  getLocalIP() {
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    
    return 'localhost';
  }

  // Настройки для WordPress
  setupWordPress(wpUrl) {
    this.config.proxy = wpUrl;
    this.config.server = false;
    console.log(`🐘 Настроен прокси для WordPress: ${wpUrl}`);
  }

  // Настройки для мобильного тестирования
  setupMobile() {
    this.config.ghostMode = {
      clicks: true,
      forms: true,
      scroll: true
    };
    this.config.open = 'external';
    console.log('📱 Настроен режим мобильного тестирования');
  }

  // Туннель для внешнего доступа
  async setupTunnel() {
    this.config.tunnel = true;
    console.log('🌍 Включён туннель для внешнего доступа');
  }

  // Статистика
  getStats() {
    if (!this.isRunning) {
      return { running: false };
    }

    return {
      running: true,
      connections: bs.sockets.sockets.size,
      port: this.config.port,
      uiPort: this.config.ui.port,
      localIP: this.getLocalIP()
    };
  }
}

// Создаём экземпляр
const bsServer = new BrowserSyncServer();

// CLI команды
if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case '--start':
      bsServer.start();
      break;
      
    case '--wordpress':
      const wpUrl = process.argv[3] || 'http://localhost:8080';
      bsServer.setupWordPress(wpUrl);
      bsServer.start();
      break;
      
    case '--mobile':
      bsServer.setupMobile();
      bsServer.start();
      break;
      
    case '--tunnel':
      bsServer.setupTunnel();
      bsServer.start();
      break;
      
    case '--stop':
      bsServer.stop();
      break;
      
    case '--stats':
      const stats = bsServer.getStats();
      console.log('\n📊 СТАТИСТИКА BROWSER-SYNC:');
      console.log('============================');
      console.log(`Статус: ${stats.running ? '✅ Запущен' : '❌ Остановлен'}`);
      if (stats.running) {
        console.log(`Подключения: ${stats.connections}`);
        console.log(`Порт: ${stats.port}`);
        console.log(`UI Порт: ${stats.uiPort}`);
        console.log(`IP: ${stats.localIP}`);
      }
      break;
      
    default:
      console.log(`
🌐 BROWSER-SYNC СЕРВЕР
======================

Команды:
  --start      Запустить сервер
  --wordpress  Запустить с WordPress прокси
  --mobile     Режим мобильного тестирования
  --tunnel     Включить внешний туннель
  --stop       Остановить сервер
  --stats      Показать статистику

Примеры:
  node scripts/browser-sync-server.js --start
  node scripts/browser-sync-server.js --wordpress http://localhost:8080
  node scripts/browser-sync-server.js --mobile
      `);
  }
}

export default bsServer; 