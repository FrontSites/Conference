// Скрипт для диагностики и исправления проблем с main-menu
// Проблема: main-menu не отображается в английской версии

console.log('🔍 Диагностика main-menu...');

// Функция для проверки существования меню
function checkMenuExistence() {
  console.log('📋 Проверяем существование меню...');
  
  // Проверяем main-menu
  const mainMenu = document.querySelector('.main-menu');
  if (mainMenu) {
    console.log('✅ main-menu найден в DOM');
    console.log('📊 Количество элементов:', mainMenu.children.length);
    
    // Проверяем видимость
    const computedStyle = window.getComputedStyle(mainMenu);
    console.log('👁️ Display:', computedStyle.display);
    console.log('👁️ Visibility:', computedStyle.visibility);
    console.log('👁️ Opacity:', computedStyle.opacity);
    
    // Проверяем родительские элементы
    let parent = mainMenu.parentElement;
    let level = 1;
    while (parent && level <= 5) {
      const parentStyle = window.getComputedStyle(parent);
      console.log(`👁️ Родитель ${level} (${parent.tagName}.${parent.className}):`, {
        display: parentStyle.display,
        visibility: parentStyle.visibility,
        opacity: parentStyle.opacity
      });
      parent = parent.parentElement;
      level++;
    }
  } else {
    console.log('❌ main-menu НЕ найден в DOM');
  }
  
  // Проверяем languages-menu
  const langMenu = document.querySelector('.language-menu');
  if (langMenu) {
    console.log('✅ languages-menu найден в DOM');
    console.log('📊 Количество элементов:', langMenu.children.length);
  } else {
    console.log('❌ languages-menu НЕ найден в DOM');
  }
}

// Функция для проверки языковых настроек
function checkLanguageSettings() {
  console.log('🌐 Проверяем языковые настройки...');
  
  const body = document.body;
  const langClass = body.className.match(/lang-(\w+)/);
  
  if (langClass) {
    console.log('✅ Языковой класс найден:', langClass[1]);
  } else {
    console.log('❌ Языковой класс НЕ найден');
  }
  
  // Проверяем все элементы с языковыми классами
  const langElements = document.querySelectorAll('[class*="lang-"]');
  console.log('🌐 Элементы с языковыми классами:', langElements.length);
  
  langElements.forEach((el, index) => {
    if (index < 5) { // Показываем только первые 5
      console.log(`  ${index + 1}. ${el.tagName}.${el.className}`);
    }
  });
}

// Функция для проверки CSS стилей
function checkCSSStyles() {
  console.log('🎨 Проверяем CSS стили...');
  
  const mainMenu = document.querySelector('.main-menu');
  if (mainMenu) {
    const styles = window.getComputedStyle(mainMenu);
    console.log('🎨 Стили main-menu:', {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      position: styles.position,
      top: styles.top,
      left: styles.left,
      width: styles.width,
      height: styles.height,
      zIndex: styles.zIndex
    });
  }
  
  const headerWrapper = document.querySelector('.header-wrapper');
  if (headerWrapper) {
    const styles = window.getComputedStyle(headerWrapper);
    console.log('🎨 Стили header-wrapper:', {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      position: styles.position,
      top: styles.top,
      left: styles.left,
      width: styles.width,
      height: styles.height,
      zIndex: styles.zIndex
    });
  }
}

// Функция для проверки WordPress меню
function checkWordPressMenu() {
  console.log('🔧 Проверяем WordPress меню...');
  
  // Проверяем, есть ли элементы меню
  const menuItems = document.querySelectorAll('.main-menu li');
  console.log('📋 Количество элементов меню:', menuItems.length);
  
  menuItems.forEach((item, index) => {
    const link = item.querySelector('a');
    if (link) {
      console.log(`  ${index + 1}. ${link.textContent.trim()} -> ${link.href}`);
    }
  });
  
  // Проверяем, есть ли пустые меню
  const emptyMenus = document.querySelectorAll('.main-menu:empty, .main-menu ul:empty');
  if (emptyMenus.length > 0) {
    console.log('⚠️ Найдены пустые меню:', emptyMenus.length);
  }
}

// Функция для принудительного отображения меню (временное решение)
function forceShowMenu() {
  console.log('🔧 Принудительно показываем меню...');
  
  const mainMenu = document.querySelector('.main-menu');
  const headerWrapper = document.querySelector('.header-wrapper');
  
  if (mainMenu) {
    mainMenu.style.display = 'flex';
    mainMenu.style.visibility = 'visible';
    mainMenu.style.opacity = '1';
    console.log('✅ main-menu принудительно показан');
  }
  
  if (headerWrapper) {
    headerWrapper.style.display = 'flex';
    headerWrapper.style.visibility = 'visible';
    headerWrapper.style.opacity = '1';
    console.log('✅ header-wrapper принудительно показан');
  }
}

// Функция для создания тестового меню (если основное не работает)
function createTestMenu() {
  console.log('🧪 Создаем тестовое меню...');
  
  const mainMenu = document.querySelector('.main-menu');
  if (!mainMenu || mainMenu.children.length === 0) {
    console.log('⚠️ Основное меню пустое, создаем тестовое...');
    
    const testMenu = document.createElement('ul');
    testMenu.className = 'main-menu test-menu';
    testMenu.innerHTML = `
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/speakers">Speakers</a></li>
      <li><a href="/schedule">Schedule</a></li>
      <li><a href="/contact">Contact</a></li>
    `;
    
    const headerWrapper = document.querySelector('.header-wrapper');
    if (headerWrapper) {
      // Вставляем после languages-menu
      const langMenu = headerWrapper.querySelector('.languages-menu');
      if (langMenu) {
        langMenu.after(testMenu);
      } else {
        headerWrapper.appendChild(testMenu);
      }
      console.log('✅ Тестовое меню создано');
    }
  }
}

// Основная функция диагностики
function runDiagnostics() {
  console.log('🚀 Запуск диагностики main-menu...');
  console.log('='.repeat(50));
  
  checkMenuExistence();
  console.log('-'.repeat(30));
  
  checkLanguageSettings();
  console.log('-'.repeat(30));
  
  checkCSSStyles();
  console.log('-'.repeat(30));
  
  checkWordPressMenu();
  console.log('-'.repeat(30));
  
  // Принудительно показываем меню
  forceShowMenu();
  console.log('-'.repeat(30));
  
  // Создаем тестовое меню если нужно
  createTestMenu();
  console.log('-'.repeat(30));
  
  console.log('✅ Диагностика завершена');
  console.log('='.repeat(50));
}

// Запускаем диагностику после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runDiagnostics);
} else {
  runDiagnostics();
}

// Экспортируем функции для использования в консоли
window.menuDiagnostics = {
  checkMenuExistence,
  checkLanguageSettings,
  checkCSSStyles,
  checkWordPressMenu,
  forceShowMenu,
  createTestMenu,
  runDiagnostics
};

console.log('💡 Используйте window.menuDiagnostics для ручной диагностики'); 