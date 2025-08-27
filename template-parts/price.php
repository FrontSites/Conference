<section class="price" id="price">
  <div class=" container">
    <h2>
      <?php the_field('price-title'); ?>
    </h2>



    <div class="price-items">
      <?php
      if (have_rows('price-items')) {
        while (have_rows('price-items')) {
          the_row();
      ?>
          <div class="price-item__wrapper">
            <div class="price-item">
              <h3><?php the_sub_field('price-item-title'); ?></h3>
              <div class="price-item__description"><?php the_sub_field('price-description'); ?></div>
              <div class="price-block">
                <div class="price-block__item left">
                  <div class="price-block__old-price">
                    <?php the_sub_field('price-old-price'); ?>
                  </div>
                  <div class="price-block__new-price">
                    <?php the_sub_field('price-new-price'); ?>
                  </div>
                </div>
                <?php
                $discount = get_sub_field('price-discount');
                if (!empty($discount)) :
                ?>
                  <div class="price-block__item right">
                    <div class="price-block__discount">
                      <?php echo $discount; ?>
                    </div>
                  </div>
                <?php endif; ?>

              </div>
              <tbx-button event-hash="73c4b185718e8b9f19934819446e95618684791e"
                lang="<?php echo esc_attr(function_exists('pll_current_language') ? pll_current_language() : (defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : 'uk')); ?>"
                currency="USD">
                <div class="main-button ticket">
                  <img src="<?php echo get_template_directory_uri(); ?>/assets/images/ticket.svg" alt="description">
                  <?php
                  if (function_exists('the_field')) {
                    the_field("ticket_button_text", "option");
                  } else {
                    echo 'Buy Ticket';
                  }
                  ?>
                </div>
              </tbx-button>
            </div>
          </div>
      <?php
        }
      }
      ?>
    </div>
    <?php
    // Выводим таймер конференции
    get_template_part('template-parts/timer');
    ?>
  </div>
  <script>
    window.addEventListener('load', function() {
      var $ = window.jQuery;
      if (!$ || typeof window.timer_ajax === 'undefined') return;

      $.post(window.timer_ajax.ajaxurl, {
          action: 'get_timer_data',
          nonce: window.timer_ajax.nonce
        })
        .done(function(resp) {
          if (!resp || !resp.success) return;
          var data = resp.data || {};
          if (!data.enabled) return;

          var $items = $('.price .price-items .price-item');

          function applyPrices(idx, prices) {
            if (!$items || !$items.length) return;
            var $item = $items.eq(idx);
            if (!$item.length || !prices) return;

            var $oldEl = $item.find('.price-block__old-price');
            var $newEl = $item.find('.price-block__new-price');

            if (data.expired) {
              // Акция закончилась: показываем старую цену как новую, старую скрываем
              $newEl.html(prices.oldPrice);
              $oldEl.hide();
            } else {
              // Идёт акция: подставляем старую и новую цены
              $oldEl.show().html(prices.oldPrice);
              $newEl.html(prices.newPrice);
            }
          }

          applyPrices(0, data.regular); // REGULAR
          applyPrices(1, data.vip); // VIP
        });
    });
  </script>
</section>