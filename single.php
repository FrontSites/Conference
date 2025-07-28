<?php get_header(); ?>

<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

  <section class="blog-post">
    <div class="container">
    <div class="author-item">
        <div class="author-img">
          <img src="<?php echo esc_url($author_photo); ?>" alt="author">
        </div>
        <div class="author-text__block">
          <div class="author-name">
            <?php echo esc_html(get_field('name', $related_post->ID)); ?>
          </div>
          <div class="author-position">
            <?php echo esc_html(get_field('position-author', $related_post->ID)); ?>
          </div>
        </div>
      </div>
      <?php if (function_exists('custom_breadcrumbs')) custom_breadcrumbs(); ?>
      <h1><?php the_title()?></h1>
      <div class="post-top__block">
        <div class="date"><?php the_date() ?></div>
        <div class="read">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
              <g clip-path="url(#clip0_1427_7414)">
                <path d="M9 17C4.85775 17 1.5 13.6423 1.5 9.5C1.5 5.35775 4.85775 2 9 2C13.1423 2 16.5 5.35775 16.5 9.5C16.5 13.6423 13.1423 17 9 17ZM9 15.5C10.5913 15.5 12.1174 14.8679 13.2426 13.7426C14.3679 12.6174 15 11.0913 15 9.5C15 7.9087 14.3679 6.38258 13.2426 5.25736C12.1174 4.13214 10.5913 3.5 9 3.5C7.4087 3.5 5.88258 4.13214 4.75736 5.25736C3.63214 6.38258 3 7.9087 3 9.5C3 11.0913 3.63214 12.6174 4.75736 13.7426C5.88258 14.8679 7.4087 15.5 9 15.5ZM9.75 9.5H12.75V11H8.25V5.75H9.75V9.5Z" fill="#050815"></path>
              </g>
              <defs>
                <clipPath id="clip0_1427_7414">
                  <rect width="18" height="18" fill="white" transform="translate(0 0.5)"></rect>
                </clipPath>
              </defs>
              <deepl-alert xmlns=""></deepl-alert><deepl-alert xmlns=""></deepl-alert><deepl-alert xmlns=""></deepl-alert>
            </svg>
          </div><?php the_field("read_mins") ?>
        </div>
      </div>
      <?php $thumbnail_html = get_the_post_thumbnail();?>
      <div class="featured-image"><?php echo $thumbnail_html; ?></div>
      <div class="blog-post__items">
        <div class="block-relative">
          <div class="sticky__menu">
            <div class="menu__position">
              <ul class="summary">
                <div class="summary-toggle">
                  <div class="summary-toggle__text">Summary</div>
                  <div class="summary-toggle__icon"><svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 14.5C11.9015 14.5005 11.8038 14.4813 11.7128 14.4435C11.6218 14.4057 11.5392 14.3501 11.47 14.28L8 10.78C7.90861 10.6391 7.86719 10.4715 7.88238 10.3042C7.89756 10.1369 7.96848 9.97954 8.08376 9.85735C8.19904 9.73515 8.352 9.65519 8.51814 9.63029C8.68428 9.6054 8.85396 9.63699 9 9.72003L12 12.72L15 9.72003C15.146 9.63699 15.3157 9.6054 15.4819 9.63029C15.648 9.65519 15.801 9.73515 15.9162 9.85735C16.0315 9.97954 16.1024 10.1369 16.1176 10.3042C16.1328 10.4715 16.0914 10.6391 16 10.78L12.5 14.28C12.3675 14.4144 12.1886 14.4931 12 14.5Z" fill="#000000"></path> </g></svg></div>
                  
                  
                </div>
                <div class="summary-content">
                <?php
// Проверяем, является ли текущая страница страницей одного поста
if (is_single()) {
    // Получаем содержимое поста
    $content = get_the_content();

    // Находим все h2 с классом wp-block-heading и добавляем айди
    $pattern = '/<h2 class="wp-block-heading">(.*?)<\/h2>/s';
    preg_match_all($pattern, $content, $matches);

    if (!empty($matches[1])) {
        echo '<ul>';
        foreach ($matches[1] as $text) {
            $id = sanitize_title($text);
            echo '<li><a href="#' . esc_attr($id) . '">' . esc_html($text) . '</a></li>';
        }
        echo '</ul>';
    } else {
        echo 'Заголовки h2 с классом wp-block-heading не найдены.';
    }
}
?>
                </div>
                
             


              </ul>
            </div>
          </div>
        </div>
        <div class="main-post">
          <?php the_content(); ?>
        </div>
      </div>
    </div>
  </section>

  <section class="section blog-section">
    <div class="container">
      <div class="star"><svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.2502 17.8937L12.96 17.6869L12.6698 17.8937L5.93101 22.6961L8.53841 14.9759L8.65839 14.6207L8.35097 14.406L1.58929 9.68412H9.92577H10.2872L10.4005 9.34097L12.9599 1.59428L15.5177 9.34089L15.6311 9.68412H15.9925H24.3304L17.5674 14.406L17.2598 14.6207L17.3799 14.976L19.9887 22.6958L13.2502 17.8937Z" stroke="#050815"></path>
        </svg>
      </div>
      <div class="blog-section__top-items">
        <h2>OTHER NEWS</h2>
        <a href="https://www.laxfreight.com/blog" class="main-btn">
          All News
          <svg width="71" height="8" viewBox="0 0 71 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70.3536 4.35355C70.5488 4.15829 70.5488 3.84171 70.3536 3.64645L67.1716 0.464466C66.9763 0.269204 66.6597 0.269204 66.4645 0.464466C66.2692 0.659728 66.2692 0.976311 66.4645 1.17157L69.2929 4L66.4645 6.82843C66.2692 7.02369 66.2692 7.34027 66.4645 7.53553C66.6597 7.7308 66.9763 7.7308 67.1716 7.53553L70.3536 4.35355ZM0 4.5L70 4.5V3.5L0 3.5L0 4.5Z" fill="white" />
          </svg>
          <span class="front"></span> <span class="backface"></span>
        </a>
      </div>

      <div class="blog-section__items">



        <?php
        $args = array(
          'post_type' => 'post',
          'posts_per_page' => 3,
        );

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
                 <a href="<?php the_permalink(); ?>"> <h3 class="title"><?php the_title(); ?></h3></a>
                  <div class="short-descr"><?php the_excerpt(); ?></div>

                </div>
                <a href="<?php the_permalink(); ?>" class="main-btn">

                  Read
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
      <a href="/blog" class="main-btn blog-mob-btn">
        All news
        <svg width="71" height="8" viewBox="0 0 71 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70.3536 4.35355C70.5488 4.15829 70.5488 3.84171 70.3536 3.64645L67.1716 0.464466C66.9763 0.269204 66.6597 0.269204 66.4645 0.464466C66.2692 0.659728 66.2692 0.976311 66.4645 1.17157L69.2929 4L66.4645 6.82843C66.2692 7.02369 66.2692 7.34027 66.4645 7.53553C66.6597 7.7308 66.9763 7.7308 67.1716 7.53553L70.3536 4.35355ZM0 4.5L70 4.5V3.5L0 3.5L0 4.5Z" fill="white" />
        </svg>
        <span class="front"></span> <span class="backface"></span>
      </a>
    </div>
  </section>


</div>


<?php get_footer(); ?>