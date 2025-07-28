<?php
/* <?= get_permalink(HOME_PAGEID) ?> */
// // Определяем текущий язык или устанавливаем 'ru' по умолчанию
// define("LANG", !function_exists('pll_current_language') ? 'ru' : pll_current_language());

// // Функция для получения значения в зависимости от языка
// function showLang($trans_text)
// {
//   return $trans_text[defined('LANG') ? LANG : 'ru'];
// }

// // Получаем ID главной страницы в зависимости от языка
// define("HOME_PAGEID", showLang(['ru' => 23, 'uk' => 1]));

// Style asds

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
    wp_enqueue_style('style-min', get_template_directory_uri() . $css_main, [], filemtime(get_template_directory() . $css_main));

    // Библиотечные стили — без filemtime и без версии
    wp_enqueue_style('select2-css', get_template_directory_uri() . '/assets/library/select2/select2.min.css');
    wp_enqueue_style('swiper-css', get_template_directory_uri() . '/assets/library/swiper/swiper-bundle.min.css');
    wp_enqueue_style('intel-tel-css', get_template_directory_uri() . '/assets/library/intel-input/intlTelInput.min.css');

    // === Scripts ===
    $js_main = '/assets/js/main.min.js';
    $js_path = get_template_directory() . $js_main;
    
    // Проверяем существование файла
    if (!file_exists($js_path)) {
        error_log('JS file not found: ' . $js_path);
    }
    
    wp_enqueue_script('main-min', get_template_directory_uri() . $js_main, ['jquery'], filemtime($js_path), true);

    // Library
    wp_enqueue_script('swiper-js', get_template_directory_uri() . '/assets/library/swiper/swiper-bundle.min.js', ['jquery'], null, true);
    wp_enqueue_script('inteltel', get_template_directory_uri() . '/assets/library/intel-input/intlTelInputWithUtils.min.js', ['jquery'], null, true);
    wp_enqueue_script('select2', get_template_directory_uri() . '/assets/library/select2/select2.min.js', ['jquery'], null, true);
    wp_enqueue_script('jquery-mask', get_template_directory_uri() . '/assets/library/maskedinput/jquery.maskedinput.js', ['jquery'], null, true);
    wp_enqueue_script('gsap', get_template_directory_uri() . '/assets/library/gsap/gsap.min.js', ['jquery'], null, true);
    wp_enqueue_script('scroll-trigger', get_template_directory_uri() . '/assets/library/gsap/ScrollTrigger.min.js', ['gsap'], null, true);
    wp_enqueue_script('justvalidation', get_template_directory_uri() . '/assets/library/validation/just-validate.production.min.js', ['jquery'], null, true);

    // === AJAX параметры для main.min.js ===
    wp_localize_script('main-min', 'ajax_object', [
        'ajaxurl' => admin_url('admin-ajax.php'),
    ]);
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_assets');





// Google Fonts асинхронная загрузка
function add_google_fonts()
{
?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@200..800&display=swap" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
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

// Convert images to webP
add_filter('wp_generate_attachment_metadata', 'convert_image_to_webp_on_upload');

function convert_image_to_webp_on_upload($metadata)
{
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

// convert webp in /assets/images/

// Регистрация расписания (ежедневно)
if (!wp_next_scheduled('convert_assets_images_to_webp_daily')) {
    wp_schedule_event(time(), 'daily', 'convert_assets_images_to_webp_daily');
}

// Отменить при деактивации темы (чтобы не висело)
add_action('switch_theme', function () {
    wp_clear_scheduled_hook('convert_assets_images_to_webp_daily');
});

// Хук на задачу
add_action('convert_assets_images_to_webp_daily', 'convert_all_images_in_assets_to_webp');

function convert_all_images_in_assets_to_webp()
{
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
}


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



add_filter('wp_check_filetype_and_ext', 'fix_svg_mime_type', 10, 5);
add_filter('wpcf7_autop_or_not', '__return_false');
# Исправление MIME типа для SVG файлов.
function fix_svg_mime_type($data, $file, $filename, $mimes, $real_mime = '')
{

    // WP 5.1 +
    if (version_compare($GLOBALS['wp_version'], '5.1.0', '>=')) {
        $dosvg = in_array($real_mime, ['image/svg', 'image/svg+xml']);
    } else {
        $dosvg = ('.svg' === strtolower(substr($filename, -4)));
    }

    // mime тип был обнулен, поправим его
    // а также проверим право пользователя
    if ($dosvg) {

        // разрешим
        if (current_user_can('manage_options')) {

            $data['ext'] = 'svg';
            $data['type'] = 'image/svg+xml';
        }
        // запретим
        else {
            $data['ext'] = false;
            $data['type'] = false;
        }
    }

    return $data;
}


register_nav_menus([
    'main-menu' => (' (main-menu)'),
]);

register_nav_menus([
    'languages-menu' => (' (languages-menu)'),
]);










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
    $social_networks = array('instagram', 'telegram', 'linkedin', 'facebook', 'twitter', 'youtube');

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
