import { defineConfig } from 'vite';
import path from 'path';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  
  // Отключаем кэширование для мгновенного обновления
  server: {
    force: true,
    hmr: {
      overlay: false
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  
  // Отключаем source maps для скорости
  build: {
    sourcemap: false,
    outDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.php') // Используем основной PHP файл
      },
      output: {
        entryFileNames: 'js/[name].min.js',
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name && chunkInfo.name.endsWith('.css')) return 'css/[name].min.css';
          return '[name]';
        }
      }
    }
  },
  
  // Отключаем CSS препроцессор, так как Gulp уже компилирует SCSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/scss/variables" as *; @use "./src/scss/mixins" as *;`
      }
    }
  },
  
  // Оптимизация для WordPress
  define: {
    'process.env.NODE_ENV': '"development"'
  },
  
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.7, 0.9], speed: 1 },
      svgo: { plugins: [{ name: 'removeViewBox', active: false }] },
      webp: { quality: 80 }
    })
  ],
  
  // Исключаем скомпилированные файлы из обработки Vite
  optimizeDeps: {
    exclude: ['assets/css/main.min.css', 'assets/js/main.min.js']
  }
}); 