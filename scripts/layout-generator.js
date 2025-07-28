// Layout Generator System
import fs from 'fs-extra';
import path from 'path';

class LayoutGenerator {
  constructor() {
    this.templatesDir = 'src/scss/layouts';
    this.outputDir = 'src/scss';
  }

  async init() {
    await fs.ensureDir(this.templatesDir);
    console.log('🎨 Генератор лейаутов инициализирован');
  }

  // Генерация CSS Grid лейаутов
  generateGrid(name, config) {
    const {
      columns = 'repeat(auto-fit, minmax(300px, 1fr))',
      rows = 'auto',
      gap = '2rem',
      areas = null,
      responsive = true
    } = config;

    let scss = `// Generated Grid Layout: ${name}\n`;
    scss += `.${name} {\n`;
    scss += `  display: grid;\n`;
    scss += `  grid-template-columns: ${columns};\n`;
    
    if (rows !== 'auto') {
      scss += `  grid-template-rows: ${rows};\n`;
    }
    
    scss += `  gap: ${gap};\n`;
    
    if (areas) {
      scss += `  grid-template-areas:\n`;
      areas.forEach(area => {
        scss += `    "${area}"\n`;
      });
    }
    
    scss += `}\n\n`;

    // Адаптивные версии
    if (responsive) {
      scss += `// Tablet version\n`;
      scss += `@media (max-width: 768px) {\n`;
      scss += `  .${name} {\n`;
      scss += `    grid-template-columns: 1fr;\n`;
      scss += `    gap: 1rem;\n`;
      scss += `  }\n`;
      scss += `}\n\n`;

      scss += `// Mobile version\n`;
      scss += `@media (max-width: 480px) {\n`;
      scss += `  .${name} {\n`;
      scss += `    gap: 0.5rem;\n`;
      scss += `  }\n`;
      scss += `}\n\n`;
    }

    return scss;
  }

  // Генерация Flexbox лейаутов
  generateFlex(name, config) {
    const {
      direction = 'row',
      justify = 'space-between',
      align = 'center',
      wrap = 'wrap',
      gap = '1rem',
      responsive = true
    } = config;

    let scss = `// Generated Flex Layout: ${name}\n`;
    scss += `.${name} {\n`;
    scss += `  display: flex;\n`;
    scss += `  flex-direction: ${direction};\n`;
    scss += `  justify-content: ${justify};\n`;
    scss += `  align-items: ${align};\n`;
    scss += `  flex-wrap: ${wrap};\n`;
    scss += `  gap: ${gap};\n`;
    scss += `}\n\n`;

    // Дочерние элементы
    scss += `.${name} > * {\n`;
    scss += `  flex: 1;\n`;
    scss += `  min-width: 0;\n`;
    scss += `}\n\n`;

    // Адаптивные версии
    if (responsive) {
      scss += `// Mobile version\n`;
      scss += `@media (max-width: 768px) {\n`;
      scss += `  .${name} {\n`;
      scss += `    flex-direction: column;\n`;
      scss += `    gap: 0.5rem;\n`;
      scss += `  }\n`;
      scss += `}\n\n`;
    }

    return scss;
  }

  // Генерация компонентных лейаутов
  generateComponent(name, type, config = {}) {
    const generators = {
      'card-grid': () => this.generateGrid(`${name}-grid`, {
        columns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        ...config
      }),
      
      'hero-section': () => this.generateFlex(`${name}-hero`, {
        direction: 'column',
        justify: 'center',
        align: 'center',
        ...config
      }),
      
      'navigation': () => this.generateFlex(`${name}-nav`, {
        direction: 'row',
        justify: 'space-between',
        align: 'center',
        ...config
      }),
      
      'sidebar-content': () => this.generateGrid(`${name}-layout`, {
        columns: '300px 1fr',
        gap: '2rem',
        areas: ['"sidebar content"'],
        ...config
      }),
      
      'three-column': () => this.generateGrid(`${name}-columns`, {
        columns: 'repeat(3, 1fr)',
        gap: '2rem',
        ...config
      })
    };

    const generator = generators[type];
    if (!generator) {
      throw new Error(`Неизвестный тип лейаута: ${type}`);
    }

    return generator();
  }

  // Сохранение лейаута в файл
  async saveLayout(name, scss, addToMain = true) {
    const fileName = `_${name}.scss`;
    const filePath = path.join(this.outputDir, fileName);
    
    await fs.writeFile(filePath, scss, 'utf8');
    console.log(`✅ Лейаут сохранён: ${fileName}`);

    // Автоматически добавляем в main.scss
    if (addToMain) {
      await this.addToMainScss(name);
    }

    return filePath;
  }

  async addToMainScss(name) {
    const mainScssPath = path.join(this.outputDir, 'main.scss');
    const importLine = `@use './${name}';`;
    
    try {
      const content = await fs.readFile(mainScssPath, 'utf8');
      
      if (!content.includes(importLine)) {
        // Находим секцию автогенерации или добавляем в конец
        const lines = content.split('\n');
        const importIndex = lines.findIndex(line => line.includes('// AUTO-GENERATED IMPORTS END'));
        
        if (importIndex !== -1) {
          lines.splice(importIndex, 0, importLine);
        } else {
          lines.push('', importLine);
        }
        
        await fs.writeFile(mainScssPath, lines.join('\n'), 'utf8');
        console.log(`✅ Добавлен импорт в main.scss: ${name}`);
      }
    } catch (error) {
      console.warn(`⚠️ Не удалось добавить в main.scss: ${error.message}`);
    }
  }

  // Предустановленные лейауты
  async generatePresets() {
    const presets = [
      {
        name: 'card-grid',
        type: 'card-grid',
        config: { columns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }
      },
      {
        name: 'hero-banner',
        type: 'hero-section',
        config: { direction: 'column', justify: 'center', align: 'center' }
      },
      {
        name: 'main-nav',
        type: 'navigation',
        config: { justify: 'space-between', align: 'center' }
      },
      {
        name: 'blog-layout',
        type: 'sidebar-content',
        config: { columns: '300px 1fr', gap: '3rem' }
      },
      {
        name: 'features',
        type: 'three-column',
        config: { gap: '3rem' }
      }
    ];

    console.log('🎨 Генерирую предустановленные лейауты...');
    
    for (const preset of presets) {
      const scss = this.generateComponent(preset.name, preset.type, preset.config);
      await this.saveLayout(preset.name, scss, false);
    }

    console.log('✅ Все предустановленные лейауты созданы!');
  }

  // Интерактивная генерация
  async interactive() {
    console.log(`
🎨 ГЕНЕРАТОР ЛЕЙАУТОВ
====================

Доступные типы:
1. card-grid      - Сетка карточек
2. hero-section   - Героический блок
3. navigation     - Навигация
4. sidebar-content - Сайдбар + контент
5. three-column   - Три колонки

Примеры команд:
node scripts/layout-generator.js --create card-grid my-cards
node scripts/layout-generator.js --presets
node scripts/layout-generator.js --list
    `);
  }

  // Список созданных лейаутов
  async listLayouts() {
    const files = await fs.readdir(this.outputDir);
    const layoutFiles = files.filter(file => file.startsWith('_') && file.endsWith('.scss'));
    
    console.log('\n📋 СОЗДАННЫЕ ЛЕЙАУТЫ:');
    console.log('====================');
    
    if (layoutFiles.length === 0) {
      console.log('Лейауты не найдены');
      return;
    }

    for (const file of layoutFiles) {
      const name = file.replace(/^_|\.scss$/g, '');
      const filePath = path.join(this.outputDir, file);
      const stats = await fs.stat(filePath);
      
      console.log(`📄 ${name}`);
      console.log(`   Файл: ${file}`);
      console.log(`   Размер: ${Math.round(stats.size / 1024)}KB`);
      console.log(`   Изменён: ${stats.mtime.toLocaleString('ru-RU')}`);
      console.log('');
    }
  }
}

// Создаём экземпляр
const layoutGen = new LayoutGenerator();

// CLI команды
if (process.argv[2]) {
  const command = process.argv[2];
  const type = process.argv[3];
  const name = process.argv[4];
  
  switch (command) {
    case '--create':
      if (!type || !name) {
        console.log('❌ Использование: --create <тип> <название>');
        process.exit(1);
      }
      layoutGen.init().then(async () => {
        try {
          const scss = layoutGen.generateComponent(name, type);
          await layoutGen.saveLayout(name, scss);
          console.log(`🎉 Лейаут "${name}" создан!`);
        } catch (error) {
          console.error('❌ Ошибка:', error.message);
        }
      });
      break;
      
    case '--presets':
      layoutGen.init().then(() => layoutGen.generatePresets());
      break;
      
    case '--list':
      layoutGen.init().then(() => layoutGen.listLayouts());
      break;
      
    case '--help':
    default:
      layoutGen.interactive();
  }
} else {
  layoutGen.interactive();
}

export default layoutGen; 