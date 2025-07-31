// gulpfile.mjs (Оптимизированная версия)

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
import cache from 'gulp-cached';
import remember from 'gulp-remember';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sassCompiler = gulpSass(dartSass);

let isCompiling = false;

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

export function compileScss(done) {
  if (isCompiling) return done();
  isCompiling = true;

  gulp.src(paths.scss.main)
    .pipe(plumber(function (err) {
      console.error('SCSS error:', err.message);
      this.emit('end');
    }))
    .pipe(cache('scss'))
    .pipe(sassCompiler({ outputStyle: 'compressed' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({ level: 1 }))
    .pipe(rename({ basename: 'main', suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
    .on('end', () => { 
      isCompiling = false; 
      console.log('✅ SCSS compiled.'); 
      done(); 
    });
}

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
    console.log(`📝 main.scss updated with ${scssFiles.length + 2} imports.`);
    done();
  }).catch(done);
}

export function minifyJs(done) {
  gulp.src(paths.js.src)
    .pipe(plumber(function (err) {
      console.error('JS error:', err.message);
      this.emit('end');
    }))
    .pipe(cache('js'))
    .pipe(concat('main.min.js'))
    .pipe(uglify({ 
      compress: { 
        drop_console: true,
        drop_debugger: true 
      } 
    }))
    .pipe(gulp.dest(paths.js.dest))
    .on('end', () => { 
      console.log('✅ JS minified.'); 
      done(); 
    });
}

export const watchFiles = gulp.series(
  gulp.parallel(compileScss, minifyJs),
  () => {
    console.log('👀 Watching files...');
    
    // SCSS файлы - только при изменении
    gulp.watch(paths.scss.src, { ignoreInitial: false }, gulp.series(compileScss))
      .on('add', (filePath) => { 
        console.log(`🆕 SCSS created: ${path.basename(filePath)}`); 
        updateMainScss(() => compileScss(() => {})); 
      })
      .on('unlink', (filePath) => { 
        console.log(`🗑️ SCSS deleted: ${path.basename(filePath)}`); 
        updateMainScss(() => compileScss(() => {})); 
      });

    // JS файлы - только при изменении
    gulp.watch(paths.js.src, { ignoreInitial: false }, gulp.series(minifyJs))
      .on('add', (filePath) => console.log(`🆕 JS created: ${path.basename(filePath)}`))
      .on('unlink', (filePath) => console.log(`🗑️ JS deleted: ${path.basename(filePath)}`));
  }
);

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
    console.log('📦 Project zipped successfully.');
    done();
  }).catch(err => {
    console.error('❌ Zip error:', err);
    done(err);
  });
}

export default gulp.series(updateMainScss, compileScss, minifyJs, watchFiles);
export const build = gulp.series(updateMainScss, compileScss, minifyJs);