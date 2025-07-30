<section class="partners">
  <div class="container">
    <h2><?php the_field('partners-title'); ?></h2>
    <p><?php the_field('partners-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('partners-items')) {
        while (have_rows('partners-items')) {
          the_row();
          $image = get_sub_field('partner-image');
      ?>
          <div class="partners-item">
            <img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>">
          </div>
      <?php
        }
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-partner'); ?>
  </div>
</section>