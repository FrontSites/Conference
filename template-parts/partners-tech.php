<section class="partners partners-tech">
  <div class="container">
    <h2><?php the_field('partners-tech-title'); ?></h2>
    <p><?php the_field('partners-tech-subtitle'); ?></p>
    <div class="partners-items">
      <?php
      if (have_rows('tech-partners')) {
        while (have_rows('tech-partners')) {
          the_row();
          $image = get_sub_field('image');
          $link = get_sub_field('link');
      ?>
          <a href="<?php echo $link; ?>" class="partners-item">
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