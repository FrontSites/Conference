<section class="price" id="price">
  <div class=" container">
    <h2>
      <?php the_field('price-title'); ?>
    </h2>
    
    <?php
    // Выводим таймер конференции
    get_template_part('template-parts/timer');
    ?>
    
    <div class="price-items">
      <?php
      // Загружаем значения таймера из опций WP
      $timer_enabled = (int) get_option('timer_enabled', 0) === 1;
      $regular = [
        'old' => get_option('timer_regular_old_price', ''),
        'new' => get_option('timer_regular_new_price', ''),
        'discount' => get_option('timer_regular_discount', ''),
        'small' => get_option('timer_regular_small_label', ''),
      ];
      $vip = [
        'old' => get_option('timer_vip_old_price', ''),
        'new' => get_option('timer_vip_new_price', ''),
        'discount' => get_option('timer_vip_discount', ''),
        'small' => get_option('timer_vip_small_label', ''),
      ];

      $item_index = 0;

      if (have_rows('price-items')) {
        while (have_rows('price-items')) {
          the_row();

          // Значения по умолчанию — из ACF
          $old_price = get_sub_field('price-old-price');
          $new_price = get_sub_field('price-new-price');
          // Больше не используем мелкую подпись и скидку
          $discount = '';
          $small_label = '';

          // Если включен таймер — подменяем данными из админки таймера
          if ($timer_enabled) {
            if ($item_index === 0) { // Первый блок — REGULAR
              $old_price = $regular['old'] ?: $old_price;
              $new_price = $regular['new'] ?: $new_price;
              $discount = $regular['discount'] ?: $discount;
              $small_label = $regular['small'] ?: $small_label;
            } elseif ($item_index === 1) { // Второй блок — VIP
              $old_price = $vip['old'] ?: $old_price;
              $new_price = $vip['new'] ?: $new_price;
              $discount = $vip['discount'] ?: $discount;
              $small_label = $vip['small'] ?: $small_label;
            }
          }

      ?>
          <div class="price-item__wrapper">
            <div class="price-item">
              <h3><?php the_sub_field('price-item-title'); ?></h3>
              <div class="price-item__description"><?php the_sub_field('price-description'); ?></div>
              <div class="price-block">
                <div class="price-block__item left">
                  <div class="price-block__old-price">
                    <?php echo $old_price; ?>
                  </div>
                  <div class="price-block__new-price">
                    <?php echo $new_price; ?>
                  </div>
                </div>
                <div class="price-block__item right">
                  <div class="price-block__small-label"></div>
                  <div class="price-block__discount"></div>
                </div>

              </div>

              <a href="<?php the_sub_field('price-link'); ?>" class="main-button ticket">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/ticket.svg" alt="description">
                <?php
                if (function_exists('the_field')) {
                  the_field("ticket_button_text", "option");
                } else {
                  echo 'Buy Ticket';
                }
                ?>
              </a>
            </div>
          </div>
      <?php
          $item_index++;
        }
      }
      ?>
    </div>
  </div>
</section>