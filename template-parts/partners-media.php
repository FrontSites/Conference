<section class="partners partners-media">
  <div class="container">
    <h2><?php the_field('partners-media-title'); ?></h2>
    <p><?php the_field('partners-media-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('partners-media-items')) {
        while (have_rows('media-partners')) {
          the_row();
          $image = get_sub_field('image');
          $link = get_sub_field('link');
      ?>
          <a href="<?php echo $link; ?>" class="partners-item">
            <?php if ($image) : ?>
              <img src="<?php echo $image; ?>" alt="Media Partner">
            <?php endif; ?>
          </a>
      <?php
        }
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-mediapartner'); ?>
  </div>
</section>