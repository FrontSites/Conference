<section class="fullset">
  <div class="container">
    <h2><?php the_field("fullset-title"); ?></h2>
    <p><?php the_field("fullset-subtitle"); ?></p>
    <div class="fullset-items">
      <div class="fullset-circle">
        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/fullset-bg.webp" alt="">
        <div class="line line-1">
          <img src="<?php echo get_template_directory_uri(); ?>/assets/images/line-22.svg" alt="description">
        </div>
        <div class="line line-2">
          <img src="<?php echo get_template_directory_uri(); ?>/assets/images/line-3.svg" alt="description">
        </div>
        <div class="line line-3">
          <img src="<?php echo get_template_directory_uri(); ?>/assets/images/line-22.svg" alt="description">
        </div>
        <div class="line line-4">
          <img src="<?php echo get_template_directory_uri(); ?>/assets/images/line-3.svg" alt="description">
        </div>
        <div class="line line-5">
          <img src="<?php echo get_template_directory_uri(); ?>/assets/images/line-22.svg" alt="description">
        </div>


      </div>
      <?php
      if (have_rows("fullset-items")) {
        while (have_rows("fullset-items")) {
          the_row();
          $title = get_sub_field("fullest-item-title");
          $text = get_sub_field("fullset-item-text");
      ?>
          <div class="fullset-item">
            <h3><?php echo $title; ?></h3>
            <p><?php echo $text; ?></p>
          </div>
      <?php
        }
      }
      ?>
    </div>
  </div>
</section>