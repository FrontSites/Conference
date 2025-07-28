import { defineConfig } from 'vite';
import path from 'path';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/scss/main.scss')
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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/scss/variables" as *; @use "./src/scss/mixins" as *;`
      }
    }
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
  ]
}); 