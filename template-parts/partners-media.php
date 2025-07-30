<section class="partners partners-media">
  <div class="container">
    <h2><?php the_field('partners-media-title'); ?></h2>
    <p><?php the_field('partners-media-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('partners-media-items')) {
        while (have_rows('partners-media-items')) {
          the_row();
          $image = get_sub_field('partner-media-image');
      ?>
          <a href="<?php the_sub_field('partner-media-link'); ?>" class="partners-item">
            <img src="<?php echo $image; ?>" alt="Partner">
          </a>
      <?php
        }
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-mediapartner'); ?>
  </div>
</section>