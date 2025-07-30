<section class="fullset">
  <div class="container">
    <h2><?php the_field("fullset-title"); ?></h2>
    <p><?php the_field("fullset-subtitle"); ?></p>
    <div class="fullset-items">
      <div class="fullset-circle">
        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/fullset-bg.webp" alt="">
      </div>
      <?php $group = get_field("fullset-items");
      if ($group) {
        foreach ($group as $item) {
          $image = $item["fullest-item-title"];
          $title = $item["fullset-item-text"];
          $description = $item["description"];
      ?>
          <div class="fullset-item">

          </div>
      <?php
        }
      }
      ?>

    </div>
  </div>
  </div>
</section>