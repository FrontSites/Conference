// vite.config.js
import { defineConfig } from "file:///C:/Users/Bohdan%20stepanenko/Desktop/conference/node_modules/vite/dist/node/index.js";
import path from "path";
import viteImagemin from "file:///C:/Users/Bohdan%20stepanenko/Desktop/conference/node_modules/vite-plugin-imagemin/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Bohdan stepanenko\\Desktop\\conference";
var vite_config_default = defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "assets",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "src/scss/main.scss")
      },
      output: {
        entryFileNames: "js/[name].min.js",
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name && chunkInfo.name.endsWith(".css")) return "css/[name].min.css";
          return "[name]";
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
      svgo: { plugins: [{ name: "removeViewBox", active: false }] },
      webp: { quality: 80 }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCb2hkYW4gc3RlcGFuZW5rb1xcXFxEZXNrdG9wXFxcXGNvbmZlcmVuY2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJvaGRhbiBzdGVwYW5lbmtvXFxcXERlc2t0b3BcXFxcY29uZmVyZW5jZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQm9oZGFuJTIwc3RlcGFuZW5rby9EZXNrdG9wL2NvbmZlcmVuY2Uvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB2aXRlSW1hZ2VtaW4gZnJvbSAndml0ZS1wbHVnaW4taW1hZ2VtaW4nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByb290OiAnLicsXHJcbiAgcHVibGljRGlyOiAncHVibGljJyxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnYXNzZXRzJyxcclxuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBtYWluOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3Njc3MvbWFpbi5zY3NzJylcclxuICAgICAgfSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0ubWluLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xyXG4gICAgICAgICAgaWYgKGNodW5rSW5mby5uYW1lICYmIGNodW5rSW5mby5uYW1lLmVuZHNXaXRoKCcuY3NzJykpIHJldHVybiAnY3NzL1tuYW1lXS5taW4uY3NzJztcclxuICAgICAgICAgIHJldHVybiAnW25hbWVdJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAdXNlIFwiLi9zcmMvc2Nzcy92YXJpYWJsZXNcIiBhcyAqOyBAdXNlIFwiLi9zcmMvc2Nzcy9taXhpbnNcIiBhcyAqO2BcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdml0ZUltYWdlbWluKHtcclxuICAgICAgZ2lmc2ljbGU6IHsgb3B0aW1pemF0aW9uTGV2ZWw6IDcgfSxcclxuICAgICAgb3B0aXBuZzogeyBvcHRpbWl6YXRpb25MZXZlbDogNyB9LFxyXG4gICAgICBtb3pqcGVnOiB7IHF1YWxpdHk6IDgwIH0sXHJcbiAgICAgIHBuZ3F1YW50OiB7IHF1YWxpdHk6IFswLjcsIDAuOV0sIHNwZWVkOiAxIH0sXHJcbiAgICAgIHN2Z286IHsgcGx1Z2luczogW3sgbmFtZTogJ3JlbW92ZVZpZXdCb3gnLCBhY3RpdmU6IGZhbHNlIH1dIH0sXHJcbiAgICAgIHdlYnA6IHsgcXVhbGl0eTogODAgfVxyXG4gICAgfSlcclxuICBdXHJcbn0pOyAiXSwKICAibWFwcGluZ3MiOiAiO0FBQXFVLFNBQVMsb0JBQW9CO0FBQ2xXLE9BQU8sVUFBVTtBQUNqQixPQUFPLGtCQUFrQjtBQUZ6QixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixXQUFXO0FBQUEsRUFDWCxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLEtBQUssUUFBUSxrQ0FBVyxvQkFBb0I7QUFBQSxNQUNwRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixjQUFJLFVBQVUsUUFBUSxVQUFVLEtBQUssU0FBUyxNQUFNLEVBQUcsUUFBTztBQUM5RCxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGFBQWE7QUFBQSxNQUNYLFVBQVUsRUFBRSxtQkFBbUIsRUFBRTtBQUFBLE1BQ2pDLFNBQVMsRUFBRSxtQkFBbUIsRUFBRTtBQUFBLE1BQ2hDLFNBQVMsRUFBRSxTQUFTLEdBQUc7QUFBQSxNQUN2QixVQUFVLEVBQUUsU0FBUyxDQUFDLEtBQUssR0FBRyxHQUFHLE9BQU8sRUFBRTtBQUFBLE1BQzFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRSxNQUFNLGlCQUFpQixRQUFRLE1BQU0sQ0FBQyxFQUFFO0FBQUEsTUFDNUQsTUFBTSxFQUFFLFNBQVMsR0FBRztBQUFBLElBQ3RCLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
