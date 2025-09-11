<section class="marque" style="display: <?php the_field('marque-display'); ?>">
  <div class="marque-items">
    <?php
    if (have_posts()) {
      while (have_posts()) {
        the_post();
        $brands = get_field('marque-item');

        if ($brands) {
          $original_brands = $brands;
          $repeat = 6; // Сколько раз продублировать набор логотипов

          for ($i = 0; $i < $repeat; $i++) {
            foreach ($original_brands as $brand) {
              $brand_text = $brand['marque-text'];
              if ($brand_image) {
    ?>
                <div class="marque-item">
                  <p><?php echo $brand_text; ?></p>
                </div>
    <?php
              }
            }
          }
        }
      }
    }
    ?>
  </div>
</section>