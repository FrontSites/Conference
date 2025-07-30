<section class="partners partners-media">
  <div class="container">
    <h2><?php the_field('partners-media-title'); ?></h2>
    <p><?php the_field('partners-media-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      // Отладочная информация
      echo '<!-- Debug: Проверяем репитер partner-media-items -->';
      
      if (have_rows('partner-media-items')) {
        echo '<!-- Debug: Репитер partner-media-items найден -->';
        while (have_rows('partner-media-items')) {
          the_row();
          $image_media = get_sub_field('partner-media-image');
          $link_media = get_sub_field('partner-media-link');
          
          echo '<!-- Debug: image_media = ' . print_r($image_media, true) . ' -->';
          echo '<!-- Debug: link_media = ' . $link_media . ' -->';
      ?>
          <a href="<?php echo $link_media; ?>" class="partners-item">
            <?php if ($image_media) : ?>
              <img src="<?php echo $image_media['url'] ? $image_media['url'] : $image_media; ?>" alt="<?php echo $image_media['alt'] ? $image_media['alt'] : 'Media Partner'; ?>">
            <?php else : ?>
              <!-- Debug: Изображение не найдено -->
              <div style="background: #ccc; width: 100px; height: 50px; display: flex; align-items: center; justify-content: center; color: #666;">No Media Image</div>
            <?php endif; ?>
          </a>
      <?php
        }
      } else {
        echo '<!-- Debug: Репитер partner-media-items не найден или пуст -->';
        echo '<p style="color: red;">Репитер partner-media-items не найден или пуст</p>';
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-mediapartner'); ?>
  </div>
</section>