import fs from 'fs-extra';
import archiver from 'archiver';
import path from 'path';

const output = fs.createWriteStream(path.resolve('theme.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`\n📦 Архив создан: theme.zip (${archive.pointer()} bytes)`);
});

archive.on('error', err => { throw err; });
archive.pipe(output);

// Добавляем только нужные файлы и папки из корня
const files = [
  'style.css',
  'functions.php',
  'header.php',
  'footer.php',
  'index.php',
  'front-page.php',
  'single.php'
];
for (const file of files) {
  if (fs.existsSync(file)) archive.file(file, { name: file });
}

// Папки
if (fs.existsSync('assets')) archive.directory('assets/', 'assets');
if (fs.existsSync('template-parts')) archive.directory('template-parts/', 'template-parts');

archive.finalize(); 