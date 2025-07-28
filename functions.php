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
    if (is_admin() || in_array($GLOBALS['pagenow'], ['wp-login.php'])) {
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
    wp_enqueue_script('main-min', get_template_directory_uri() . $js_main, ['jquery'], filemtime(get_template_directory() . $js_main), true);

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




// Custom post type function
// function create_postType() {
// 	register_post_type(
// 		'services',
// 		// CPT Options
// 		array(
// 			'labels'          => array(
// 				'name'          => __( 'Services' ),
// 				'singular_name' => __( 'Services' ),
// 			),
// 			'public'          => true,
// 			'has_archive'     => false,
// 			'rewrite' => ['slug' => 'services', 'with_front' => false], // ❗️важно: with_front = false
// 			'capability_type' => 'post',
// 			'show_in_rest'    => true,
// 			'supports'        => array( 'editor', 'title', 'excerpt', 'thumbnail' ),
// 			'taxonomies'      => array( 'category' )
// 		)
// 	);

// 	register_post_type(
// 		'Industries',
// 		// CPT Options
// 		array(
// 			'labels'          => array(
// 				'name'          => __( 'Industries' ),
// 				'singular_name' => __( 'Industries' ),
// 			),
// 			'public'          => true,
// 			'has_archive'     => false,
// 			'rewrite'         => array( 'slug' => 'Industries' ),
// 			'capability_type' => 'post',
// 			'show_in_rest'    => true,
// 			'supports'        => array( 'editor', 'title', 'excerpt', 'thumbnail' ),
//       'taxonomies'      => array( 'category' )
// 		)
// 	);
// }
// // Hooking up CPT function to theme setup
// add_action( 'init', 'create_postType' );

register_nav_menus([
    'main-menu' => (' (main-menu)'),
]);

register_nav_menus([
    'languages-menu' => (' (languages-menu)'),
]);









// Enqueue your script properly in your theme's functions.php file or a custom plugin.





// Добавляем функцию для обработки AJAX-запроса

// Добавление раздела "Контакты" в раздел "Настройки" (Customizer)
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




// function pagination($args = array())
// {
//   $defaults = array(
//     'range'           => 4,
//     'custom_query'    => FALSE,
//     // 'previous_string' => __( '', 'text-domain' ),
//     'previous_string' => __('', 'text-domain'),
//     // 'next_string'     => __( '', 'text-domain' ),
//     'next_string'     => __('', 'text-domain'),
//     'before_output'   => '<nav class="pagination-area"><ul class="pagination">',
//     'after_output'    => '</ul></nav>'
//   );

//   $args = wp_parse_args($args, apply_filters('wp_bootstrap_pagination_defaults', $defaults));

//   $args['range'] = (int) $args['range'] - 1;
//   if (!$args['custom_query'])
//     $args['custom_query'] = @$GLOBALS['wp_query'];
//   $count = (int) $args['custom_query']->max_num_pages;
//   $page  = intval(get_query_var('paged'));
//   $ceil  = ceil($args['range'] / 2);

//   if ($count <= 1)
//     return FALSE;

//   if (!$page)
//     $page = 1;

//   if ($count > $args['range']) {
//     if ($page <= $args['range']) {
//       $min = 1;
//       $max = $args['range'] + 1;
//     } elseif ($page >= ($count - $ceil)) {
//       $min = $count - $args['range'];
//       $max = $count;
//     } elseif ($page >= $args['range'] && $page < ($count - $ceil)) {
//       $min = $page - $ceil;
//       $max = $page + $ceil;
//     }
//   } else {
//     $min = 1;
//     $max = $count;
//   }

//   $echo = '';
//   $previous = intval($page) - 1;
//   $previous = esc_attr(get_pagenum_link($previous));

//   $firstpage = esc_attr(get_pagenum_link(1));
//   if ($firstpage && (1 != $page))
//     $echo .= '';
//   // $echo .= '<li class="previous page-item"><a class="page-link" href="' . $firstpage . '">' . __( '<i class="material-icons mi">first_page</i>', 'text-domain' ) . '</a></li>';
//   if ($previous && (1 != $page))
//     $echo .= '<li class="page-item prev"><a class="page-link" href="' . $previous . '" title="' . __('previous', 'text-domain') . '"> <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" xml:space="preserve" width="20px" height="20px"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;} </style> <path d="M29.6,4.6l-18,18L10.2,24l1.4,1.4l18,18l2.9-2.9L15.9,24L32.4,7.4L29.6,4.6z"></path> <rect class="st0" width="48" height="48"></rect> <rect class="st0" width="48" height="48"></rect> <rect x="12" y="12" class="st0" width="24" height="24"></rect> </g></svg>' . $args['previous_string'] . '</a></li>';

//   if (!empty($min) && !empty($max)) {
//     for ($i = $min; $i <= $max; $i++) {
//       if ($page == $i) {
//         $echo .= '<li class="page-item active"><a class="page-link">' . str_pad((int)$i, 2, ' ', STR_PAD_LEFT) . '</a></li>';
//       } else {
//         $echo .= sprintf('<li class="page-item"><a class="page-link" href="%s">%2d</a></li>', esc_attr(get_pagenum_link($i)), $i);
//       }
//     }
//   }

//   $next = intval($page) + 1;
//   $next = esc_attr(get_pagenum_link($next));
//   if ($next && ($count != $page))
//     $echo .= '<li class="page-item next"><a class="page-link" href="' . $next . '" title="' . __('next', 'text-domain') . '"> <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve" width="20px" height="20px"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;} </style> <path d="M8.7,2.3L7.3,3.7l8.3,8.3l-8.3,8.3l1.4,1.4l9.7-9.7L8.7,2.3z"></path> <rect class="st0" width="24" height="24"></rect> </g></svg>' . $args['next_string'] . '</a></li>';

//   $lastpage = esc_attr(get_pagenum_link($count));
//   /* if ( $lastpage ) {
//         $echo .= '<li class="page-item next"><a class="page-link" href="' . $lastpage . '">' . __( '<i class="material-icons mi">last_page</i>', 'text-domain' ) . '</a></li>';
//     } */
//   if (isset($echo))
//     echo $args['before_output'] . $echo . $args['after_output'];
// }



// function custom_main_query_order($query) {
//   if ($query->is_main_query() && !is_admin()) {
//       $orderby = isset($_GET['orderby']) ? $_GET['orderby'] : 'date';

//       switch ($orderby) {
//           case 'oldest':
//               $query->set('orderby', 'date');
//               $query->set('order', 'ASC');
//               break;
//           case 'latest':
//               $query->set('orderby', 'date');
//               $query->set('order', 'DESC');
//               break;
//           // Добавьте другие ваши кастомные сортировки здесь
//           default:
//               // По умолчанию сортировка по дате
//               $query->set('orderby', 'date');
//               $query->set('order', 'DESC');
//               break;
//       }
//   }
// }

// add_action('pre_get_posts', 'custom_main_query_order');



// Функция для вывода динамических хлебных крошек
function custom_breadcrumbs()
{
    global $post;

    echo '<div class="breadcrumbs">';

    // Главная страница
    echo '<a href="' . home_url() . '">' . 'Main' . '</a>';

    // Категории (если это запись в категории)
    // Категории (если это запись в категории)
    $category = get_the_category();
    if (!empty($category)) {
        $category_link = get_category_link($category[0]->term_id);
        $category_link = str_replace('/category/', '/', $category_link); // Убираем "category" из URL
        echo '<span class="separator"> / </span>';
        echo '<a href="' . $category_link . '">' . $category[0]->cat_name . '</a>';
    }

    // Запись (если это запись)
    if (is_single()) {
        echo '<span class="separator"> / </span>';
        the_title();
    }

    // Страница (если это страница)
    if (is_page()) {
        echo '<span class="separator"> / </span>';
        echo the_title();
    }

    // Завершаем вывод хлебных крошек
    echo '</div>';
}






function custom_wpseo_title($title)
{
    global $paged, $page;

    if (is_paged() && $paged > 1) {
        $title .= 'Site  News - Stay Ahead of all Logistics Innovations | Page  ' . max($paged, $page);
    }

    return $title;
}
add_filter('wpseo_title', 'custom_wpseo_title');

function custom_wpseo_metadesc($description)
{
    global $paged, $page;

    if (is_paged() && $paged > 1) {
        $description .= 'Stay up to date with the latest news, trends and ideas in the logistics industry. Site is committed to ensuring the success of your business | Page ' . max($paged, $page);
    }

    return $description;
}
add_filter('wpseo_metadesc', 'custom_wpseo_metadesc');

// Функция для отправки данных в Telegram
// function send_message_to_telegram($message)
// {
//     $telegram_token = '7521653552:AAFHfnmf5gET7b542uXHH0itykYKfnwkWqI'; // Замените на токен вашего бота
//     $chat_id = '-chat-id'; // Замените на ID вашего чата или группы

//     $url = "https://api.telegram.org/bot$telegram_token/sendMessage";

//     // Формируем данные для отправки
//     $data = array(
//         'chat_id' => $chat_id,
//         'text' => $message,
//     );

//     // Отправка запроса с помощью wp_remote_post
//     wp_remote_post($url, array(
//         'method' => 'POST',
//         'body' => $data,
//     ));
// }

// // Функция для обработки формы и отправки письма и сообщения в Telegram
// function handle_contact_form()
// {
//     if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['comment']) && isset($_POST['name-form'])) {
//         $name = sanitize_text_field($_POST['name']);
//         $email = sanitize_email($_POST['email']);
//         $comment = sanitize_text_field($_POST['comment']);
//         $name_form = sanitize_text_field($_POST['name-form']);

//         // Проверяем, существует ли поле company
//         $company = isset($_POST['company']) ? sanitize_text_field($_POST['company']) : 'N/A'; // Если нет - 'N/A'

//         // Проверяем, существует ли поле position
//         $position = isset($_POST['position']) ? sanitize_text_field($_POST['position']) : 'N/A'; // Если нет - 'N/A'

//         // Подготовка сообщения для отправки в Telegram
//         $telegram_message = "$name_form - new application:\nName: $name\nEmail: $email\nMessage: $comment";
//         if ($company !== 'N/A') {
//             $telegram_message .= "\nCompany: $company";
//         }
//         if ($position !== 'N/A') {
//             $telegram_message .= "\nPosition: $position";
//         }

//         send_message_to_telegram($telegram_message); // Отправляем сообщение в Telegram

//         // Формируем параметры письма для отправки через wp_mail
//         $to = 'bohdan.stepanenko@logity.tech'; // Замените на email получателя
//         $subject = "$name_form - New application"; // Тема письма
//         $body = "Name: $name\nEmail: $email\nMessage: $comment";
//         if ($company !== 'N/A') {
//             $body .= "\nYour company MC: $company";
//         }
//         if ($position !== 'N/A') {
//             $body .= "\nPosition: $position";
//         }

//         $headers = array('Content-Type: text/plain; charset=UTF-8', "Reply-To: $email");

//         // Отправляем письмо через wp_mail
//         if (wp_mail($to, $subject, $body, $headers)) {
//             echo 'Success';
//         } else {
//             echo 'Failed to send email';
//         }
//     }
//     if ( ! isset( $_POST['custom_form_nonce_field'] ) || ! wp_verify_nonce( $_POST['custom_form_nonce_field'], 'custom_form_nonce_action' ) ) {
//         wp_send_json_error( array( 'message' => 'Ошибка безопасности. Попробуйте снова.' ) );
//         wp_die();
//     }

//     wp_die(); // Заканчиваем выполнение, важно для AJAX
// }

// add_action('wp_ajax_handle_contact_form', 'handle_contact_form'); // Для авторизованных пользователей
// add_action('wp_ajax_nopriv_handle_contact_form', 'handle_contact_form'); // Для неавторизованных пользователей



// functions.php

/**
 * Функция для проверки токена reCAPTCHA
 */


/**
 * Обработка AJAX-запросов для кастомных форм с проверкой reCAPTCHA
 */


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
