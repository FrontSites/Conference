<section class="partners partners-tech">
  <div class="container">
    <h2><?php the_field('partners-tech-title'); ?></h2>
    <p><?php the_field('partners-tech-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      // Отладочная информация
      echo '<!-- Debug: Проверяем репитер partners-tech-items -->';
      
      if (have_rows('partners-tech-items')) {
        echo '<!-- Debug: Репитер partners-tech-items найден -->';
        while (have_rows('partners-tech-items')) {
          the_row();
          $image_tech = get_sub_field('partner-tech-image');
          $link_tech = get_sub_field('partner-tech-link');
          
          echo '<!-- Debug: image_tech = ' . print_r($image_tech, true) . ' -->';
          echo '<!-- Debug: link_tech = ' . $link_tech . ' -->';
      ?>
          <a href="<?php echo $link_tech; ?>" class="partners-item">
            <?php if ($image_tech) : ?>
              <img src="<?php echo $image_tech['url'] ? $image_tech['url'] : $image_tech; ?>" alt="<?php echo $image_tech['alt'] ? $image_tech['alt'] : 'Tech Partner'; ?>">
            <?php else : ?>
              <!-- Debug: Изображение не найдено -->
              <div style="background: #ccc; width: 100px; height: 50px; display: flex; align-items: center; justify-content: center; color: #666;">No Tech Image</div>
            <?php endif; ?>
          </a>
      <?php
        }
      } else {
        echo '<!-- Debug: Репитер partners-tech-items не найден или пуст -->';
        echo '<p style="color: red;">Репитер partners-tech-items не найден или пуст</p>';
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-techpartner'); ?>
  </div>
</section>