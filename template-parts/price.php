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
                <div class="price-block__item right">
                  <div class="price-block__small-label">
                    <?php the_sub_field('price-small-label'); ?>
                  </div>
                  <div class="price-block__discount">
                    <?php the_sub_field('price-discount'); ?>
                  </div>
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
        }
      }
      ?>
    </div>
  </div>
</section>