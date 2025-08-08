<section class="partners partners-tech">
  <div class="container">
    <h2><?php the_field('partners-tech-title'); ?></h2>
    <p><?php the_field('partners-tech-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('partners-tech-items')) {
        while (have_rows('partners-tech-items')) {
          the_row();
          $image = get_sub_field('partner-tech-image');
          $link = get_sub_field('partner-tech-link');
      ?>
          <a href="<?php echo $link; ?>" class="partners-item" target="_blank">
            <?php if ($image) : ?>
              <img src="<?php echo $image; ?>" alt="Tech Partner">
            <?php endif; ?>
          </a>
      <?php
        }
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-techpartner'); ?>
  </div>
</section>