<?php

/**
 * Template name: Blog
 * The Blog page template file
 */
?>
<?php get_header(); ?>


<section class="section blog-section">
    <div class="container">
    <?php if (function_exists('custom_breadcrumbs')) custom_breadcrumbs(); ?>
        <div class="star"><svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.2502 17.8937L12.96 17.6869L12.6698 17.8937L5.93101 22.6961L8.53841 14.9759L8.65839 14.6207L8.35097 14.406L1.58929 9.68412H9.92577H10.2872L10.4005 9.34097L12.9599 1.59428L15.5177 9.34089L15.6311 9.68412H15.9925H24.3304L17.5674 14.406L17.2598 14.6207L17.3799 14.976L19.9887 22.6958L13.2502 17.8937Z" stroke="#050815"></path>
            </svg>
        </div>

        <h2>News & Blog</h2>
        <div class="subtitle">Get the latest news, global updates and useful articles on the trucking business.</div>
        <div class="filters-wrap">
            <?php
            // Получение выбранного типа сортировки из URL
            // $sort_type = isset($_GET['sort-type']) ? $_GET['sort-type'] : 'date-desc';
            // $args = array(
                //     'post_type'      => 'post', // Тип поста (можете изменить на 'page', если нужны страницы)
                //     'posts_per_page' => 10,     // Количество постов на странице
                //     'orderby'        => isset($_GET['orderby']) ? $_GET['orderby'] : 'date', // Поле для сортировки (по умолчанию - по дате)
                //     'order'          => isset($_GET['order']) && strtoupper($_GET['order']) === 'ASC' ? 'ASC' : 'DESC', // Порядок сортировки (ASC или DESC)
                // );

            $sort_type = !empty($_GET['sort-type']) ? $_GET['sort-type'] : 'date-desc';
            $sorting = explode('-', $sort_type);
            $sorting = [
                'orderby'   => !empty($sorting[0]) ? $sorting[0] : 'date',
                'order'     => !empty($sorting[1]) ? strtoupper($sorting[1]) : 'DESC'
            ];

            $args = [
                'post_type'      => 'post', // Тип поста (можете изменить на 'page', если нужны страницы)
                'posts_per_page' => 10,     // Количество постов на странице
                'orderby'        => $sorting['orderby'],
                'order'          => $sorting['order'],
                'paged'          => (get_query_var('paged')) ? get_query_var('paged') : 1,
            ];

            // print_r($args);

            // Изменение параметров запроса в зависимости от выбранного типа сортировки
            // switch ($sort_type) {
            //     case 'date-asc':
            //         $args['order'] = 'ASC';
            //         break;
            //     case 'date-desc':
            //         $args['order'] = 'DESC';
            //         break;
            //     case 'popularity':
            //         // Логика для сортировки по популярности, если требуется
            //         break;
            // }
            // Вывод HTML-формы для выбора сортировки
            echo '<form method="get" action="" id="sort-form">';
            echo '<select name="sort-type" id="sort-type">';
            echo '<option value="date-asc" ' . selected($sort_type, 'date-asc', false) . '>Oldest</option>';
            echo '<option value="date-desc" ' . selected($sort_type, 'date-desc', false) . '>Latest</option>';
            echo '<option value="popularity" ' . selected($sort_type, 'popularity', false) . '>Most popular</option>';
            echo '</select>';
            echo '<input type="submit" value="submit" style="display: none;">';
            echo '</form>';
            ?>
        </div>
        <div class="category-list" id="category-filters">
    <ul>
        <li class="category-link" data-category="all">Все</li>
        <?php
        $args = array(
            'hide_empty' => true, // Скрыть пустые категории
            'exclude'    => array(get_cat_ID('Блог'), get_cat_ID('Автор')), // Исключить категории по их названиям
        );
        $categories = get_categories($args);
        foreach ($categories as $category) {
            $posts_count = $category->count; // Получаем количество постов в категории
            if ($posts_count > 0) { // Проверяем, есть ли посты в категории
                ?>
                <li class="category-link" data-category="<?php echo esc_attr($category->name); ?>"><?php echo esc_html($category->name); ?></li>
            <?php }
        } ?>
    </ul>
    <!-- Nonce для безопасности -->
    <input type="hidden" id="category_nonce" value="<?php echo wp_create_nonce('load_more_posts'); ?>">
</div>
        <div class="blog-section__items">
    <?php
    $query = new WP_Query($args);

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $thumbnail_html = get_the_post_thumbnail();
            ?>

            <div class="blog-section__item">
                <a href="<?php the_permalink(); ?>" class="featured-image"><?php echo $thumbnail_html; ?></a>
                <div class="text-block">
                    <div class="date"><?php echo get_the_date(); ?></div>
                    <a href="<?php the_permalink(); ?>"><h3 class="title"><?php the_title(); ?></h3></a>
                    <div class="short-descr"><?php the_excerpt(); ?></div>
                </div>
                <a href="<?php the_permalink(); ?>" class="main-btn">
                    Read news
                    <svg width="71" height="8" viewBox="0 0 71 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M70.3536 4.35355C70.5488 4.15829 70.5488 3.84171 70.3536 3.64645L67.1716 0.464466C66.9763 0.269204 66.6597 0.269204 66.4645 0.464466C66.2692 0.659728 66.2692 0.976311 66.4645 1.17157L69.2929 4L66.4645 6.82843C66.2692 7.02369 66.2692 7.34027 66.4645 7.53553C66.6597 7.7308 66.9763 7.7308 67.1716 7.53553L70.3536 4.35355ZM0 4.5L70 4.5V3.5L0 3.5L0 4.5Z" fill="white" />
                  </svg>
                    <span class="front front-reverse"></span> <span class="backface backface-reverse"></span>
                </a>
            </div>

            <?php
        }

        wp_reset_postdata();
    } else {
        echo 'No posts found';
    }
    ?>
</div>

<!-- Pagination -->
<div class="pagination">
    <?php
    // Стандартная пагинация WordPress
    echo paginate_links(array(
        'total'     => $query->max_num_pages,
        'current'   => max(1, get_query_var('paged')),
        'prev_text' => '<span class="custom-prev-text arrow"><svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.75 16.25C13.6515 16.2505 13.5538 16.2313 13.4628 16.1935C13.3718 16.1557 13.2893 16.1001 13.22 16.03L9.72001 12.53C9.57956 12.3894 9.50067 12.1988 9.50067 12C9.50067 11.8013 9.57956 11.6107 9.72001 11.47L13.22 8.00003C13.361 7.90864 13.5285 7.86722 13.6958 7.88241C13.8631 7.89759 14.0205 7.96851 14.1427 8.08379C14.2649 8.19907 14.3448 8.35203 14.3697 8.51817C14.3946 8.68431 14.363 8.85399 14.28 9.00003L11.28 12L14.28 15C14.4205 15.1407 14.4994 15.3313 14.4994 15.53C14.4994 15.7288 14.4205 15.9194 14.28 16.06C14.1353 16.1907 13.9448 16.259 13.75 16.25Z" fill="#000000"></path> </g></svg></span>',
        'next_text' => '<span class="custom-next-text arrow"><svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.25 16.25C10.1493 16.2466 10.0503 16.2227 9.95921 16.1797C9.86807 16.1367 9.78668 16.0756 9.72001 16C9.57956 15.8594 9.50067 15.6688 9.50067 15.47C9.50067 15.2713 9.57956 15.0806 9.72001 14.94L12.72 11.94L9.72001 8.94002C9.66069 8.79601 9.64767 8.63711 9.68277 8.48536C9.71786 8.33361 9.79933 8.19656 9.91586 8.09322C10.0324 7.98988 10.1782 7.92538 10.3331 7.90868C10.4879 7.89198 10.6441 7.92391 10.78 8.00002L14.28 11.5C14.4205 11.6407 14.4994 11.8313 14.4994 12.03C14.4994 12.2288 14.4205 12.4194 14.28 12.56L10.78 16C10.7133 16.0756 10.6319 16.1367 10.5408 16.1797C10.4497 16.2227 10.3507 16.2466 10.25 16.25Z" fill="#000000"></path> </g></svg></span>',
    ));
    ?>
</div>
</div>

    </div>

</section>

<?php get_footer(); ?>