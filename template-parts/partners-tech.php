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
      ?>
          <a href="<?php the_sub_field('partner-tech-link'); ?>" class="partners-item">
            <img src="<?php echo $image_tech; ?>" alt="Partner">
          </a>
      <?php
        }
      }
      ?>
    </div>
    <?php get_template_part('template-parts/buttons/button-techpartner'); ?>
  </div>
</section>