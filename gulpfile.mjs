// gulpfile.mjs (Максимально быстрая версия)

import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import fs from 'fs-extra';
import path from 'path';
import pkg from 'glob';
const { glob } = pkg;
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sassCompiler = gulpSass(dartSass);

const paths = {
  scss: {
    src: 'src/scss/**/*.scss',
    main: 'src/scss/main.scss',
    dest: 'assets/css'
  },
  js: {
    src: ['src/js/*.js', '!src/js/*.min.js'],
    dest: 'assets/js'
  }
};

const importStartMarker = '// AUTO-GENERATED IMPORTS START';
const importEndMarker = '// AUTO-GENERATED IMPORTS END';

// БЫСТРАЯ КОМПИЛЯЦИЯ SCSS
export function compileScss(done) {
  console.log('⚡ Быстрая компиляция SCSS...');
  
  gulp.src(paths.scss.main)
    .pipe(plumber(function (err) {
      console.error('SCSS error:', err.message);
      this.emit('end');
    }))
    .pipe(sassCompiler({ 
      outputStyle: 'compressed',
      sourceMap: false // Отключаем source maps для скорости
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({ 
      level: 1,
      format: 'keep-breaks' // Быстрее чем полная оптимизация
    }))
    .pipe(rename({ basename: 'main', suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
    .on('end', () => { 
      console.log('✅ SCSS скомпилирован мгновенно!'); 
      done(); 
    });
}

// БЫСТРОЕ ОБНОВЛЕНИЕ MAIN.SCSS
export function updateMainScss(done) {
  const files = glob.sync(paths.scss.src);
  let scssFiles = files.filter(file =>
    !file.endsWith('main.scss') &&
    !file.endsWith('variables.scss') &&
    !file.endsWith('mixins.scss')
  );

  scssFiles.sort((a, b) => {
    if (a.includes('variables.scss')) return -1;
    if (b.includes('variables.scss')) return 1;
    if (a.includes('mixins.scss')) return -1;
    if (b.includes('mixins.scss')) return 1;
    return a.localeCompare(b);
  });

  const imports = [
    '@use "./variables" as *;',
    '@use "./mixins" as *;',
    '',
    ...scssFiles.map(file => {
      const relative = path.relative(path.dirname(paths.scss.main), file).replace(/\\/g, '/').replace('.scss', '');
      return `@use "./${relative}" as *;`;
    })
  ].join('\n');

  fs.readFile(paths.scss.main, 'utf8').then(currentContent => {
    const startIndex = currentContent.indexOf(importStartMarker);
    const endIndex = currentContent.indexOf(importEndMarker);
    if (startIndex === -1 || endIndex === -1) return done(new Error('Markers not found'));

    const before = currentContent.slice(0, startIndex + importStartMarker.length);
    const after = currentContent.slice(endIndex);
    return fs.writeFile(paths.scss.main, `${before}\n${imports}\n${after}`, 'utf8');
  }).then(() => {
    console.log(`📝 main.scss обновлён с ${scssFiles.length + 2} импортами.`);
    done();
  }).catch(done);
}

// БЫСТРАЯ МИНИФИКАЦИЯ JS
export function minifyJs(done) {
  console.log('⚡ Быстрая минификация JS...');
  
  gulp.src(paths.js.src)
    .pipe(plumber(function (err) {
      console.error('JS error:', err.message);
      this.emit('end');
    }))
    .pipe(concat('main.min.js'))
    .pipe(uglify({ 
      compress: { 
        drop_console: true,
        drop_debugger: true,
        passes: 1 // Только один проход для скорости
      },
      mangle: {
        toplevel: false // Быстрее
      }
    }))
    .pipe(gulp.dest(paths.js.dest))
    .on('end', () => { 
      console.log('✅ JS минифицирован мгновенно!'); 
      done(); 
    });
}

// МГНОВЕННОЕ ОТСЛЕЖИВАНИЕ
export const watchFiles = gulp.series(
  gulp.parallel(compileScss, minifyJs),
  () => {
    console.log('👀 Мгновенное отслеживание файлов...');
    
    // SCSS файлы - мгновенная компиляция
    gulp.watch(paths.scss.src, { ignoreInitial: false }, (done) => {
      console.log('📝 SCSS изменён - мгновенная компиляция...');
      compileScss(done);
    })
    .on('add', (filePath) => { 
      console.log(`🆕 SCSS создан: ${path.basename(filePath)}`); 
      updateMainScss(() => compileScss(() => {})); 
    })
    .on('unlink', (filePath) => { 
      console.log(`🗑️ SCSS удалён: ${path.basename(filePath)}`); 
      updateMainScss(() => compileScss(() => {})); 
    });

    // JS файлы - мгновенная минификация
    gulp.watch(paths.js.src, { ignoreInitial: false }, (done) => {
      console.log('📜 JS изменён - мгновенная минификация...');
      minifyJs(done);
    })
    .on('add', (filePath) => console.log(`🆕 JS создан: ${path.basename(filePath)}`))
    .on('unlink', (filePath) => console.log(`🗑️ JS удалён: ${path.basename(filePath)}`));
  }
);

// БЫСТРАЯ СБОРКА
export const build = gulp.series(updateMainScss, compileScss, minifyJs);

// ZIP ПРОЕКТА
export function zipProject(done) {
  fs.readFile('style.css', 'utf8').then(data => {
    const match = data.match(/Theme Name:\s*(.+)/i);
    const projectName = match ? match[1].trim() : 'project';
    return import('gulp-zip').then(({ default: zip }) => {
      return gulp.src([
        '**/*',
        '!node_modules/**',
        '!src/**',
        '!gulpfile.*',
        '!package*.json',
        '!assets/css/main.css',
        '!assets/js/!(*.min).js'
      ], { base: '.' })
        .pipe(zip(`${projectName}.zip`))
        .pipe(gulp.dest('C:/Users/Bohdan stepanenko/Desktop'));
    });
  }).then(() => {
    console.log('📦 Проект упакован успешно.');
    done();
  }).catch(err => {
    console.error('❌ Ошибка упаковки:', err);
    done(err);
  });
}

// ЭКСПОРТЫ
export default gulp.series(updateMainScss, compileScss, minifyJs, watchFiles);