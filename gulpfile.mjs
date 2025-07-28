// gulpfile.mjs (Full version with SCSS, JS, PHP, auto-template creation, and zip build)

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
import sharp from 'sharp';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sassCompiler = gulpSass(dartSass);

const execAsync = promisify(exec);

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
  },
  php: {
    frontPage: 'front-page.php',
    templateParts: 'template-parts/**/*.php'
  },
  images: {
    src: 'assets/images/**/*.{jpg,jpeg,png}',
    dest: 'assets/images'
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
    .pipe(sassCompiler())
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({ basename: 'main', suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
    .on('end', () => { isCompiling = false; console.log('SCSS compiled.'); done(); });
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
    console.log(`main.scss updated with ${scssFiles.length + 2} imports.`);
    done();
  }).catch(done);
}

export function addMixinsAndVariablesToScssFiles(filePath, done) {
  const fileName = path.basename(filePath);
  if (!filePath.endsWith('.scss') || ['main.scss', 'variables.scss', 'mixins.scss'].includes(fileName)) return done?.();

  fs.readFile(filePath, 'utf8')
    .then(content => {
      if (content.includes('@use "./variables"') && content.includes('@use "./mixins"')) return;
      return fs.writeFile(filePath, `@use "./variables" as *;\n@use "./mixins" as *;\n\n${content}`, 'utf8');
    })
    .then(() => { console.log(`✅ Auto @use added to ${fileName}`); done?.(); })
    .catch(err => { console.error(`❌ Error writing to ${fileName}:`, err); done?.(); });
}

function addTemplatePart(filePath, done) {
  const relativePath = path.relative('template-parts', filePath).replace(/\\/g, '/').replace('.php', '');
  const getTemplatePartLine = `<?php get_template_part('template-parts/${relativePath}'); ?>`;

  fs.readFile(paths.php.frontPage, 'utf8').then(data => {
    const lines = data.split(/\r?\n/);
    const alreadyExists = lines.some(line => line.trim() === getTemplatePartLine);
    if (alreadyExists) return done();

    // Найти все импорты секций внутри <main>
    const mainIndex = lines.findIndex(line => /<main>/i.test(line));
    let insertIndex = mainIndex + 1;
    for (let i = mainIndex + 1; i < lines.length; i++) {
      if (/get_template_part\('template-parts\//.test(lines[i])) {
        insertIndex = i + 1;
      } else if (lines[i].includes('</main>') || lines[i].includes('<?php get_footer(); ?>')) {
        break;
      }
    }
    lines.splice(insertIndex, 0, getTemplatePartLine);
    return fs.writeFile(paths.php.frontPage, lines.join('\n'), 'utf8');
  }).then(() => { console.log(`📥 Template inserted: ${relativePath}`); done(); }).catch(done);
}

function removeTemplatePart(filePath, done) {
  const relativePath = path.relative('template-parts', filePath).replace(/\\/g, '/').replace('.php', '');
  const getTemplatePartLine = `<?php get_template_part('template-parts/${relativePath}'); ?>`;

  fs.readFile(paths.php.frontPage, 'utf8').then(data => {
    const lines = data.split(/\r?\n/);
    const index = lines.findIndex(line => line.trim() === getTemplatePartLine);
    if (index === -1) return done();
    lines.splice(index, 1);
    return fs.writeFile(paths.php.frontPage, lines.join('\n'), 'utf8');
  }).then(() => { console.log(`🗑️ Template removed: ${relativePath}`); done(); }).catch(done);
}

function createCustomPhpTemplate(filePath, done) {
  const fileName = path.basename(filePath, '.php');
  const templateName = fileName.replace(/-/g, ' ');
  const content = `<?php\n/*\nTemplate name: ${templateName}\n*/\n?>\n<?php get_header(); ?>\n<?php get_template_part('template-parts/hero'); ?>\n<?php get_footer(); ?>`;

  fs.writeFile(filePath, content, 'utf8').then(() => {
    console.log(`📄 Created template: ${filePath}`);
    done();
  }).catch(err => { console.error('❌ Failed to create PHP template:', err); done(); });
}

export function minifyJs(done) {
  gulp.src(paths.js.src)
    .pipe(plumber(function (err) {
      console.error('JS error:', err.message);
      this.emit('end');
    }))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .on('end', () => { console.log('JS minified.'); done(); });
}

function watchPhpFiles() {
  gulp.watch(paths.php.templateParts, { events: ['add', 'unlink'] })
    .on('add', (filePath) => { console.log(`➕ PHP added: ${filePath}`); addTemplatePart(filePath, () => {}); })
    .on('unlink', (filePath) => { console.log(`❌ PHP removed: ${filePath}`); removeTemplatePart(filePath, () => {}); });

  gulp.watch(['**/*.php', `!${paths.php.templateParts}`], { events: ['add'] })
    .on('add', (filePath) => { console.log(`🆕 PHP created: ${filePath}`); createCustomPhpTemplate(filePath, () => {}); });
}

// Функция для очистки старых файлов при запуске
async function cleanupOldFiles() {
  const filesToDelete = glob.sync('assets/images/*.{jpg,jpeg,png}');
  const bakFilesToDelete = glob.sync('assets/images/*.bak');
  
  if (filesToDelete.length === 0 && bakFilesToDelete.length === 0) {
    return;
  }

  console.log('🧹 Очистка старых файлов...');
  
  // Удаляем оригинальные файлы, если есть WebP версии
  for (const file of filesToDelete) {
    const webpFile = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    if (await fs.pathExists(webpFile)) {
      try {
        await fs.remove(file);
        console.log(`🗑️ Удалён старый файл: ${path.basename(file)}`);
      } catch (err) {
        // Игнорируем ошибки - файл всё ещё заблокирован
      }
    }
  }

  // Агрессивно удаляем все .bak файлы
  for (const bakFile of bakFilesToDelete) {
    const originalName = path.basename(bakFile, '.bak');
    await deleteBakFileAggressively(bakFile, originalName);
  }
}

// Функция для мгновенной конвертации новых изображений
async function convertSingleImage(filePath) {
  try {
    console.log(`🖼️ Обрабатываю новое изображение: ${path.basename(filePath)}`);
    
    const webpFile = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Конвертируем в WebP
    await sharp(filePath)
      .webp({ quality: 90, effort: 4 })
      .toFile(webpFile);
    
    console.log(`✅ Конвертировано: ${path.basename(filePath)} → ${path.basename(webpFile)}`);
    
    // Принудительное удаление оригинала
    setTimeout(async () => {
      await forceDeleteFile(filePath);
    }, 1000);
    
  } catch (err) {
    console.error(`❌ Ошибка конвертации ${filePath}:`, err.message);
  }
}

// Агрессивная функция удаления файлов для Windows
async function forceDeleteFile(filePath) {
  const fileName = path.basename(filePath);
  
  try {
    // Метод 1: Стандартное удаление
    await fs.remove(filePath);
    console.log(`🗑️ Оригинал удалён: ${fileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err1) {
    console.log(`⚠️ Стандартное удаление не сработало, пробую переименование...`);
  }

  try {
    // Метод 2: Переименование в .bak (обходит блокировки)
    const bakFile = filePath + '.bak';
    await fs.move(filePath, bakFile);
    console.log(`📦 Оригинал переименован в .bak: ${fileName}`);
    
    // Агрессивное удаление .bak файла с множественными попытками
    setTimeout(async () => {
      await deleteBakFileAggressively(bakFile, fileName);
    }, 3000); // Увеличиваем время ожидания до 3 секунд
    return;
  } catch (err2) {
    console.log(`⚠️ Переименование не сработало, пробую принудительные методы...`);
  }

  try {
    // Метод 3: Снимаем атрибуты только для чтения
    await execAsync(`attrib -R "${filePath}"`);
    await fs.remove(filePath);
    console.log(`🗑️ Оригинал удалён (после снятия атрибутов): ${fileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err3) {
    console.log(`⚠️ Удаление с attrib не сработало, пробую del...`);
  }

  try {
    // Метод 4: Принудительное удаление через del
    await execAsync(`del /f /q "${filePath}"`);
    console.log(`🗑️ Оригинал удалён (через del): ${fileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err4) {
    console.log(`⚠️ Del не сработал, пробую PowerShell...`);
  }

  try {
    // Метод 5: PowerShell принудительное удаление
    await execAsync(`powershell -Command "Remove-Item '${filePath}' -Force"`);
    console.log(`🗑️ Оригинал удалён (через PowerShell): ${fileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err5) {
    console.warn(`❌ Все методы удаления не сработали для ${fileName}`);
    console.log(`💡 Файл будет удалён при следующем запуске системы`);
    console.log(`🔧 Попробуйте запустить PowerShell от имени администратора`);
  }
}

// Агрессивная функция удаления .bak файлов
async function deleteBakFileAggressively(bakFile, originalFileName) {
  const bakFileName = path.basename(bakFile);
  
  // Попытка 1: Стандартное удаление
  try {
    await fs.remove(bakFile);
    console.log(`🗑️ .bak файл удалён: ${bakFileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err1) {
    console.log(`⚠️ Стандартное удаление .bak не сработало, пробую другие методы...`);
  }

  // Попытка 2: Снятие атрибутов и удаление
  try {
    await execAsync(`attrib -R -H -S "${bakFile}"`);
    await fs.remove(bakFile);
    console.log(`🗑️ .bak файл удалён (после снятия атрибутов): ${bakFileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err2) {
    console.log(`⚠️ Удаление с attrib не сработало...`);
  }

  // Попытка 3: Командная строка del
  try {
    await execAsync(`del /f /q /a "${bakFile}"`);
    console.log(`🗑️ .bak файл удалён (через del): ${bakFileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err3) {
    console.log(`⚠️ Del команда не сработала...`);
  }

  // Попытка 4: PowerShell принудительное удаление
  try {
    await execAsync(`powershell -Command "Remove-Item '${bakFile}' -Force -ErrorAction SilentlyContinue"`);
    console.log(`🗑️ .bak файл удалён (через PowerShell): ${bakFileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err4) {
    console.log(`⚠️ PowerShell не сработал...`);
  }

  // Попытка 5: Переименование в временный файл и удаление
  try {
    const tempFile = bakFile + '.tmp';
    await fs.move(bakFile, tempFile);
    await fs.remove(tempFile);
    console.log(`🗑️ .bak файл удалён (через переименование): ${bakFileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err5) {
    console.log(`⚠️ Переименование не сработало...`);
  }

  // Попытка 6: Запись пустого содержимого и удаление
  try {
    await fs.writeFile(bakFile, '');
    await fs.remove(bakFile);
    console.log(`🗑️ .bak файл удалён (через перезапись): ${bakFileName}`);
    console.log(`🎉 Готово! Остался только WebP файл`);
    return;
  } catch (err6) {
    console.log(`⚠️ Перезапись не сработала...`);
  }

  // Если ничего не сработало
  console.warn(`❌ Не удалось удалить .bak файл: ${bakFileName}`);
  console.log(`💾 Файл ${bakFileName} сохранён для ручного удаления`);
  console.log(`💡 WebP файл создан успешно, можно удалить .bak вручную`);
}

export function convertToWebp(done) {
  // Сначала очищаем старые файлы
  cleanupOldFiles().then(() => {
    const originalFiles = glob.sync(paths.images.src);
    
    if (originalFiles.length === 0) {
      console.log('🖼️ Нет картинок для конвертации');
      return done();
    }

    console.log(`🖼️ Найдено ${originalFiles.length} изображений для конвертации`);

    let processed = 0;
    const total = originalFiles.length;

    originalFiles.forEach(async (file) => {
      await convertSingleImage(file);
      
      processed++;
      if (processed === total) {
        console.log('🖼️ Все картинки обработаны!');
        done();
      }
    });
  });
}

export const watchFiles = gulp.series(
  gulp.parallel(compileScss, minifyJs),
  () => {
    // Очищаем старые файлы при запуске
    cleanupOldFiles();
    
    console.log('👀 Наблюдение за файлами запущено...');
    console.log('🖼️ Система автоконвертации изображений активна!');
    
    // SCSS файлы
    gulp.watch(paths.scss.src, gulp.series(compileScss))
      .on('add', (filePath) => { console.log(`🆕 SCSS created: ${filePath}`); addMixinsAndVariablesToScssFiles(filePath, () => updateMainScss(() => compileScss(() => {}))); })
      .on('unlink', (filePath) => { console.log(`🗑️ SCSS deleted: ${filePath}`); updateMainScss(() => compileScss(() => {})); });

    // JS файлы  
    gulp.watch(paths.js.src, gulp.series(minifyJs))
      .on('add', (filePath) => console.log(`🆕 JS created: ${filePath}`))
      .on('unlink', (filePath) => console.log(`🗑️ JS deleted: ${filePath}`));

    // Изображения - МГНОВЕННАЯ КОНВЕРТАЦИЯ!
    gulp.watch(paths.images.src, { events: ['add'] })
      .on('add', (filePath) => {
        // Проверяем, что это не WebP файл
        if (!filePath.match(/\.webp$/i)) {
          convertSingleImage(filePath);
        }
      });

    // PHP файлы
    gulp.watch(paths.php.templateParts, { events: ['add', 'unlink'] })
      .on('add', (filePath) => { console.log(`🆕 PHP created: ${filePath}`); addTemplatePart(filePath, () => {}); })
      .on('unlink', (filePath) => { console.log(`🗑️ PHP deleted: ${filePath}`); removeTemplatePart(filePath, () => {}); });

    // Отдельный watch для создания кастомных PHP шаблонов
    gulp.watch(['**/*.php', `!${paths.php.templateParts}`], { events: ['add'] })
      .on('add', (filePath) => { console.log(`🆕 PHP created: ${filePath}`); createCustomPhpTemplate(filePath, () => {}); });
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
        '!assets/scss/**',
        '!gulpfile.*',
        '!assets/css/main.css',
        '!assets/js/!(*.min).js', // исключить только НЕ-минифицированные
        '!package*.json'
      ], { base: '.' })
        .pipe(zip(`${projectName}.zip`))
        .pipe(gulp.dest('C:/Users/Bohdan stepanenko/Desktop'));
    });
  }).then(() => {
    console.log('📦 Проект успешно упакован в zip.');
    done();
  }).catch(err => {
    console.error('❌ Ошибка при создании архива:', err);
    done(err);
  });
}

export default gulp.series(updateMainScss, compileScss, minifyJs, watchFiles);
export const build = gulp.series(updateMainScss, compileScss, minifyJs);