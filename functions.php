<?php
// functions.php

/**
 * Подключение скрипта reCAPTCHA и локализация переменных
 */
function my_theme_enqueue_assets()
{
    // Блокируем загрузку только на админских страницах
    if (is_admin()) {
        return;
    }

    // === jQuery ===
    wp_deregister_script('jquery');
    wp_register_script('jquery', 'https://code.jquery.com/jquery-3.7.1.min.js', [], '3.7.1', true);
    wp_enqueue_script('jquery');

    // === Styles ===
    $css_main = '/assets/css/main.min.css';
    $css_path = get_template_directory() . $css_main;

    // Используем filemtime для кеширования, но только если файл существует
    $css_version = file_exists($css_path) ? filemtime($css_path) : '1.0.0';
    wp_enqueue_style('style-min', get_template_directory_uri() . $css_main, [], $css_version);

    // Библиотечные стили — без filemtime и без версии
    wp_enqueue_style('select2-css', get_template_directory_uri() . '/assets/library/select2/select2.min.css');

    // === Scripts ===
    $js_main = '/assets/js/main.min.js';
    $js_path = get_template_directory() . $js_main;
    $js_url = get_template_directory_uri() . $js_main;

    // Используем filemtime для кеширования, но только если файл существует
    $js_version = file_exists($js_path) ? filemtime($js_path) : '1.0.0';
    wp_enqueue_script('main-min', $js_url, ['jquery'], $js_version, true);

    // Library
    wp_enqueue_script('select2', get_template_directory_uri() . '/assets/library/select2/select2.min.js', ['jquery'], null, true);
    wp_enqueue_script('jquery-mask', get_template_directory_uri() . '/assets/library/maskedinput/jquery.maskedinput.js', ['jquery'], null, true);

    // === AJAX параметры для main.min.js ===
    wp_localize_script('main-min', 'ajax_object', [
        'ajaxurl' => admin_url('admin-ajax.php'),
    ]);

    // === Google Maps API Key ===
    if (defined('GOOGLE_MAPS_API_KEY')) {
        // Определяем текущий язык
        $current_lang = 'uk'; // По умолчанию украинский
        if (function_exists('pll_current_language')) {
            $current_lang = pll_current_language();
        } elseif (function_exists('icl_object_id')) {
            $current_lang = ICL_LANGUAGE_CODE;
        }

        wp_localize_script('main-min', 'mapConfig', [
            'apiKey' => GOOGLE_MAPS_API_KEY,
            'language' => $current_lang
        ]);
    }
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_assets');

// Google Fonts асинхронная загрузка с preload
function add_google_fonts()
{
?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@200..800&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@200..800&display=swap" rel="stylesheet">
    </noscript>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" async></script>
<?php
}

add_action('wp_head', 'add_google_fonts');

// more tools for posts
add_theme_support('post-thumbnails');
add_theme_support('title-tag');
add_theme_support('custom-logo');

add_filter('upload_mimes', 'svg_upload_allow');

# Добавляет SVG в список разрешенных для загрузки файлов.
function svg_upload_allow($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}

// Convert images to webP - оптимизированная версия
add_filter('wp_generate_attachment_metadata', 'convert_image_to_webp_on_upload');

function convert_image_to_webp_on_upload($metadata)
{
    // Проверяем, включена ли конвертация в настройках
    if (!get_option('enable_webp_conversion', true)) {
        return $metadata;
    }

    $upload_dir = wp_upload_dir();
    $base_dir = trailingslashit($upload_dir['basedir']);

    // Конвертировать оригинал
    $original_file = $base_dir . $metadata['file'];
    convert_to_webp($original_file);

    // Конвертировать все размеры
    if (!empty($metadata['sizes'])) {
        foreach ($metadata['sizes'] as $data) {
            $filepath = $base_dir . $data['file'];
            convert_to_webp($filepath);
        }
    }

    return $metadata;
}

// Оптимизированная конвертация assets изображений - запускается только при необходимости
function convert_all_images_in_assets_to_webp()
{
    // Проверяем, нужно ли конвертировать
    $last_conversion = get_option('last_assets_conversion', 0);
    $conversion_interval = 7 * DAY_IN_SECONDS; // Раз в неделю

    if (time() - $last_conversion < $conversion_interval) {
        return;
    }

    $dir = get_template_directory() . '/assets/images/';
    $images = glob($dir . '*.{jpg,jpeg,png}', GLOB_BRACE);

    foreach ($images as $image_path) {
        $info = pathinfo($image_path);
        $webp_path = $info['dirname'] . '/' . $info['filename'] . '.webp';

        if (!file_exists($webp_path)) {
            $ext = strtolower($info['extension']);
            if ($ext === 'png') {
                $image = @imagecreatefrompng($image_path);
            } else {
                $image = @imagecreatefromjpeg($image_path);
            }

            if ($image) {
                imagewebp($image, $webp_path, 80);
                imagedestroy($image);
            }
        }
    }

    // Обновляем время последней конвертации
    update_option('last_assets_conversion', time());
}

// Регистрация расписания (еженедельно вместо ежедневно)
if (!wp_next_scheduled('convert_assets_images_to_webp_weekly')) {
    wp_schedule_event(time(), 'weekly', 'convert_assets_images_to_webp_weekly');
}

// Отменить при деактивации темы
add_action('switch_theme', function () {
    wp_clear_scheduled_hook('convert_assets_images_to_webp_weekly');
});

// Хук на задачу
add_action('convert_assets_images_to_webp_weekly', 'convert_all_images_in_assets_to_webp');

function convert_to_webp($filepath)
{
    $info = pathinfo($filepath);
    $ext = strtolower($info['extension']);
    $webp_path = $info['dirname'] . '/' . $info['filename'] . '.webp';

    if (!file_exists($webp_path) && in_array($ext, ['jpg', 'jpeg', 'png'])) {
        if ($ext === 'png') {
            $image = @imagecreatefrompng($filepath);
        } else {
            $image = @imagecreatefromjpeg($filepath);
        }

        if ($image) {
            imagewebp($image, $webp_path, 80);
            imagedestroy($image);
        }
    }
}

// Добавляем кеширование для статических файлов
function add_cache_headers()
{
    if (!is_admin()) {
        // Кеширование для CSS и JS файлов
        if (strpos($_SERVER['REQUEST_URI'], '.css') !== false || strpos($_SERVER['REQUEST_URI'], '.js') !== false) {
            header('Cache-Control: public, max-age=31536000'); // 1 год
            header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000));
        }

        // Кеширование для изображений
        if (
            strpos($_SERVER['REQUEST_URI'], '.jpg') !== false ||
            strpos($_SERVER['REQUEST_URI'], '.jpeg') !== false ||
            strpos($_SERVER['REQUEST_URI'], '.png') !== false ||
            strpos($_SERVER['REQUEST_URI'], '.webp') !== false ||
            strpos($_SERVER['REQUEST_URI'], '.svg') !== false
        ) {
            header('Cache-Control: public, max-age=31536000'); // 1 год
            header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000));
        }
    }
}
add_action('send_headers', 'add_cache_headers');

// Оптимизация загрузки изображений
function add_image_optimization()
{
    if (!is_admin()) {
        echo '<script>
        // Lazy loading для изображений
        document.addEventListener("DOMContentLoaded", function() {
            var images = document.querySelectorAll("img[data-src]");
            var imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove("lazy");
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        });
        </script>';
    }
}
add_action('wp_footer', 'add_image_optimization');












function custom_customize_register($wp_customize)
{
    // Создаем раздел "Контакты"
    $wp_customize->add_section('contact_section', array(
        'title' => 'Contacts',
        'priority' => 30,
    ));

    // Добавляем поле для адреса
    $wp_customize->add_setting('contact_address', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('contact_address', array(
        'label' => 'Address',
        'section' => 'contact_section',
        'type' => 'text',
    ));

    // Добавляем поле для телефона
    $wp_customize->add_setting('contact_phone', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('contact_phone', array(
        'label' => 'Phone',
        'section' => 'contact_section',
        'type' => 'text',
    ));

    // Добавляем поле для адреса электронной почты
    $wp_customize->add_setting('contact_email', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_email',
    ));

    $wp_customize->add_control('contact_email', array(
        'label' => 'Email',
        'section' => 'contact_section',
        'type' => 'email',
    ));

    // Социальные сети
    $social_networks = array('instagram', 'telegram', 'linkedin', 'facebook', 'twitter', 'youtube', 'tiktok');

    foreach ($social_networks as $network) {
        // Добавляем поле для ссылки на социальную сеть
        $wp_customize->add_setting("{$network}_url", array(
            'default' => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control("{$network}_url", array(
            'label' => ucfirst($network) . ' URL',
            'section' => 'contact_section',
            'type' => 'url',
        ));

        // Добавляем поле для названия социальной сети или SVG-кода
        $wp_customize->add_setting("{$network}_name", array(
            'default' => ucfirst($network),
            'sanitize_callback' => 'sanitize_custom_html', // Пользовательская функция санитизации
        ));

        $wp_customize->add_control("{$network}_name", array(
            'label' => ucfirst($network) . ' Name or SVG',
            'section' => 'contact_section',
            'type' => 'textarea',
        ));

        // Добавляем поле для загрузки иконки социальной сети
        $wp_customize->add_setting("{$network}_icon", array(
            'default' => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, "{$network}_icon", array(
            'label' => ucfirst($network) . ' Icon',
            'section' => 'contact_section',
            'settings' => "{$network}_icon",
        )));
    }
}

add_action('customize_register', 'custom_customize_register');

// Пользовательская функция для санитизации HTML (разрешает SVG)
function sanitize_custom_html($input)
{
    return wp_kses($input, array(
        'svg' => array(
            'width' => true,
            'height' => true,
            'viewBox' => true,
            'xmlns' => true,
            'xmlns:xlink' => true,
            'fill' => true,
            'stroke' => true,
            'stroke-width' => true,
            'stroke-linecap' => true,
            'stroke-linejoin' => true,
            'class' => true,
            'id' => true,
            'style' => true,
            'viewBox' => true,
        ),
        'path' => array(
            'd' => true,
            'fill' => true,
            'stroke' => true,
            'stroke-width' => true,
            'stroke-linecap' => true,
            'stroke-linejoin' => true,
        ),
        'circle' => array(
            'cx' => true,
            'cy' => true,
            'r' => true,
            'fill' => true,
            'stroke' => true,
            'stroke-width' => true,
        ),
        'rect' => array(
            'x' => true,
            'y' => true,
            'width' => true,
            'height' => true,
            'fill' => true,
            'stroke' => true,
            'stroke-width' => true,
        ),
        'style' => true,
    ));
}



// Удаление автоматического оборачивания пустых тегов вокруг полей CF7
function remove_cf7_autop()
{
    add_filter('wpcf7_autop_or_not', '__return_false');
}
add_action('init', 'remove_cf7_autop');







function custom_metabox_styles()
{
    echo '<style>
    /* ЧЁТНЫЕ МЕТАБОКСЫ: матовый лиловый фон */
    .meta-box-sortables .postbox:nth-child(2n) .postbox-header {
        background: #B0A0D4 !important; /* матовый лиловый */
        color: #222 !important;         /* тёмно-серый текст */
    }
    .meta-box-sortables .postbox:nth-child(2n) .postbox-header h2,
    .meta-box-sortables .postbox:nth-child(2n) .postbox-header .order-higher-indicator:before,
    .meta-box-sortables .postbox:nth-child(2n) .postbox-header .toggle-indicator:before {
        color: #222 !important;
    }

    /* НЕЧЁТНЫЕ МЕТАБОКСЫ: матовый зелёный фон */
    .meta-box-sortables .postbox:nth-child(2n+1) .postbox-header {
        background: #A3C6A3 !important; /* матовый зелёный */
        color: #222 !important;
    }
    .meta-box-sortables .postbox:nth-child(2n+1) .postbox-header h2,
    .meta-box-sortables .postbox:nth-child(2n+1) .postbox-header .order-higher-indicator:before,
    .meta-box-sortables .postbox:nth-child(2n+1) .postbox-header .toggle-indicator:before {
        color: #222 !important;
    }
    </style>';
}

add_action('admin_head-post.php', 'custom_metabox_styles');
add_action('admin_head-post-new.php', 'custom_metabox_styles');

// Svg sprites
function sprite_icon($icon_name, $class_name = '', $sprite_path = '/sprite.svg')
{
    if (!$icon_name) {
        return;
    }

    $full_path = get_template_directory() . $sprite_path;
    $file_time = file_exists($full_path) ? filemtime($full_path) : time();

    $sprite_url = get_template_directory_uri() . $sprite_path . '?ver=' . $file_time;
    $class_attr = $class_name ? ' class="' . esc_attr($class_name) . '"' : '';

    echo '<svg' . $class_attr . ' aria-hidden="true" focusable="false">';
    echo '<use xlink:href="' . esc_url($sprite_url) . '#' . esc_attr($icon_name) . '"></use>';
    echo '</svg>';
}
