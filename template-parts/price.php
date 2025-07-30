<section class="price">
  <div class="container">
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
                    <s><?php the_sub_field('price-old-price'); ?></s>
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
                <?php get_template_part('template-parts/buttons/ticket-button'); ?>
              </div>
            </div>
          </div>
      <?php
        }
      }
      ?>
    </div>
  </div>
</section>