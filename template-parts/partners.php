<section class="partners">
  <div class="container">
    <h2><?php the_field('partners-title'); ?></h2>
    <p><?php the_field('partners-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('partners-items')) {
        while (have_rows('partners-items')) {
          the_row();
          $image_partner = get_sub_field('partner-image');
          $link_partner = get_sub_field('partner-link');
      ?>
          <a href="<?php echo $link_partner; ?>" class="partners-item">
            <?php if ($image_partner) : ?>
              <img src="<?php echo $image_partner['url'] ? $image_partner['url'] : $image_partner; ?>" alt="<?php echo $image_partner['alt'] ? $image_partner['alt'] : 'Partner'; ?>">
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