<section class="partners" id="partners">
  <div class="container">
    <h2><?php the_field('partners-title'); ?></h2>
    <p><?php the_field('partners-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('partners-items')) {
        while (have_rows('partners-items')) {
          the_row();
          $image = get_sub_field('partner-image');
          $link = get_sub_field('partner-link');
      ?>
          <a href="<?php echo $link; ?>" class="partners-item">
            <?php if ($image) : ?>
              <img src="<?php echo $image; ?>" alt="Partner">
            <?php endif; ?>
          </a>
      <?php
        }
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-partner'); ?>
  </div>
</section>