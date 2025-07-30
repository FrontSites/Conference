<section class="partners partners-tech">
  <div class="container">
    <h2><?php the_field('partners-tech-title'); ?></h2>
    <p><?php the_field('partners-tech-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('partners-tech-items')) {
        while (have_rows('partners-tech-items')) {
          the_row();
          $image_tech = get_sub_field('partner-tech-image');
          $link_tech = get_sub_field('partner-tech-link');
      ?>
          <a href="<?php echo $link_tech; ?>" class="partners-item" <?php echo $link_tech ? '' : 'style="pointer-events: none;"'; ?>>
            <?php if ($image_tech) : ?>
              <img src="<?php echo $image_tech['url'] ? $image_tech['url'] : $image_tech; ?>" alt="<?php echo $image_tech['alt'] ? $image_tech['alt'] : 'Tech Partner'; ?>">
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