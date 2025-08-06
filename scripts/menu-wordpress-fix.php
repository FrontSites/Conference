<?php
/**
 * Скрипт для диагностики и исправления проблем с main-menu в WordPress
 * Проблема: main-menu не отображается в английской версии
 */

// Подключаем WordPress
require_once('../../../wp-config.php');

echo "🔍 Диагностика main-menu в WordPress...\n";
echo "=" . str_repeat("=", 50) . "\n";

// Функция для проверки зарегистрированных меню
function checkRegisteredMenus() {
    echo "📋 Проверяем зарегистрированные меню...\n";
    
    $nav_menus = get_nav_menu_locations();
    echo "Найдено зарегистрированных меню: " . count($nav_menus) . "\n";
    
    foreach ($nav_menus as $location => $menu_id) {
        echo "  - $location: ID $menu_id\n";
        
        if ($menu_id) {
            $menu = wp_get_nav_menu_object($menu_id);
            if ($menu) {
                echo "    Название: " . $menu->name . "\n";
                echo "    Количество элементов: " . $menu->count . "\n";
            } else {
                echo "    ❌ Меню не найдено\n";
            }
        } else {
            echo "    ❌ ID меню равен 0\n";
        }
    }
    echo "\n";
}

// Функция для проверки элементов меню
function checkMenuItems($menu_location) {
    echo "📋 Проверяем элементы меню '$menu_location'...\n";
    
    $menu_items = wp_get_nav_menu_items($menu_location);
    
    if ($menu_items) {
        echo "Найдено элементов: " . count($menu_items) . "\n";
        
        foreach ($menu_items as $item) {
            echo "  - " . $item->title . " -> " . $item->url . " (ID: " . $item->ID . ")\n";
        }
    } else {
        echo "❌ Элементы меню не найдены\n";
    }
    echo "\n";
}

// Функция для создания тестового меню
function createTestMenu() {
    echo "🧪 Создаем тестовое меню...\n";
    
    // Проверяем, есть ли уже меню с названием "Main Menu"
    $existing_menu = wp_get_nav_menu_object('Main Menu');
    
    if ($existing_menu) {
        echo "✅ Меню 'Main Menu' уже существует (ID: " . $existing_menu->term_id . ")\n";
        return $existing_menu->term_id;
    }
    
    // Создаем новое меню
    $menu_id = wp_create_nav_menu('Main Menu');
    
    if (is_wp_error($menu_id)) {
        echo "❌ Ошибка создания меню: " . $menu_id->get_error_message() . "\n";
        return false;
    }
    
    echo "✅ Меню 'Main Menu' создано (ID: $menu_id)\n";
    
    // Добавляем элементы меню
    $menu_items = [
        ['title' => 'Home', 'url' => home_url('/')],
        ['title' => 'About', 'url' => home_url('/about/')],
        ['title' => 'Speakers', 'url' => home_url('/speakers/')],
        ['title' => 'Schedule', 'url' => home_url('/schedule/')],
        ['title' => 'Contact', 'url' => home_url('/contact/')],
    ];
    
    foreach ($menu_items as $item) {
        $item_id = wp_update_nav_menu_item($menu_id, 0, [
            'menu-item-title' => $item['title'],
            'menu-item-url' => $item['url'],
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
        ]);
        
        if (is_wp_error($item_id)) {
            echo "❌ Ошибка добавления элемента '{$item['title']}': " . $item_id->get_error_message() . "\n";
        } else {
            echo "✅ Добавлен элемент: {$item['title']}\n";
        }
    }
    
    return $menu_id;
}

// Функция для назначения меню в локацию
function assignMenuToLocation($menu_id, $location) {
    echo "🔧 Назначаем меню в локацию '$location'...\n";
    
    $locations = get_nav_menu_locations();
    $locations[$location] = $menu_id;
    
    $result = set_nav_menu_locations($locations);
    
    if ($result) {
        echo "✅ Меню успешно назначено в локацию '$location'\n";
    } else {
        echo "❌ Ошибка назначения меню в локацию '$location'\n";
    }
    echo "\n";
}

// Функция для проверки языковых настроек
function checkLanguageSettings() {
    echo "🌐 Проверяем языковые настройки...\n";
    
    $locale = get_locale();
    echo "Текущая локаль: $locale\n";
    
    $language = substr($locale, 0, 2);
    echo "Язык: $language\n";
    
    // Проверяем, есть ли плагин многоязычности
    $active_plugins = get_option('active_plugins');
    $multilingual_plugins = ['polylang', 'wpml', 'qtranslate'];
    
    foreach ($multilingual_plugins as $plugin) {
        if (in_array($plugin . '/' . $plugin . '.php', $active_plugins)) {
            echo "✅ Найден плагин многоязычности: $plugin\n";
        }
    }
    
    echo "\n";
}

// Функция для проверки темы
function checkThemeSettings() {
    echo "🎨 Проверяем настройки темы...\n";
    
    $theme = wp_get_theme();
    echo "Активная тема: " . $theme->get('Name') . "\n";
    echo "Версия темы: " . $theme->get('Version') . "\n";
    
    // Проверяем, поддерживает ли тема меню
    $theme_supports = get_theme_support('menus');
    if ($theme_supports) {
        echo "✅ Тема поддерживает меню\n";
        print_r($theme_supports);
    } else {
        echo "❌ Тема не поддерживает меню\n";
    }
    
    echo "\n";
}

// Функция для очистки кэша
function clearCache() {
    echo "🧹 Очищаем кэш...\n";
    
    // Очищаем кэш WordPress
    wp_cache_flush();
    echo "✅ Кэш WordPress очищен\n";
    
    // Очищаем кэш меню
    delete_transient('nav_menu_cache');
    echo "✅ Кэш меню очищен\n";
    
    // Очищаем кэш темы
    if (function_exists('wp_clean_themes_cache')) {
        wp_clean_themes_cache();
        echo "✅ Кэш темы очищен\n";
    }
    
    echo "\n";
}

// Основная функция диагностики
function runWordPressDiagnostics() {
    echo "🚀 Запуск диагностики WordPress...\n";
    echo "=" . str_repeat("=", 50) . "\n";
    
    checkRegisteredMenus();
    checkLanguageSettings();
    checkThemeSettings();
    
    // Проверяем main-menu
    echo "📋 Проверяем main-menu...\n";
    $main_menu_items = wp_get_nav_menu_items('main-menu');
    if ($main_menu_items) {
        echo "✅ main-menu найден, элементов: " . count($main_menu_items) . "\n";
    } else {
        echo "❌ main-menu не найден или пустой\n";
        
        // Создаем тестовое меню
        $menu_id = createTestMenu();
        if ($menu_id) {
            assignMenuToLocation($menu_id, 'main-menu');
        }
    }
    
    // Проверяем languages-menu
    echo "📋 Проверяем languages-menu...\n";
    $lang_menu_items = wp_get_nav_menu_items('languages-menu');
    if ($lang_menu_items) {
        echo "✅ languages-menu найден, элементов: " . count($lang_menu_items) . "\n";
    } else {
        echo "❌ languages-menu не найден или пустой\n";
    }
    
    clearCache();
    
    echo "✅ Диагностика WordPress завершена\n";
    echo "=" . str_repeat("=", 50) . "\n";
}

// Запускаем диагностику
runWordPressDiagnostics();

// Выводим инструкции для дальнейших действий
echo "\n📝 Инструкции для исправления:\n";
echo "1. Зайдите в админ-панель WordPress\n";
echo "2. Перейдите в Внешний вид > Меню\n";
echo "3. Убедитесь, что меню 'Main Menu' существует и содержит элементы\n";
echo "4. В разделе 'Управление расположением' назначьте меню в локацию 'main-menu'\n";
echo "5. Сохраните изменения\n";
echo "6. Очистите кэш сайта\n";
echo "7. Проверьте отображение меню на сайте\n";

echo "\n🔧 Если проблема остается:\n";
echo "1. Проверьте консоль браузера на наличие ошибок JavaScript\n";
echo "2. Проверьте, не блокируют ли CSS стили отображение меню\n";
echo "3. Убедитесь, что тема правильно поддерживает меню\n";
echo "4. Проверьте настройки многоязычности, если используется\n";
?> 