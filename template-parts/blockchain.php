<section class="blockchain">
  .
  <div class="blockchain-img-block">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/sched-image.png" alt="description">
    <div class="blockchain-img-text">
      <?php the_field("sched-item-text"); ?>
    </div>
  </div>
  <img class="blockchain-bg" src="<?php echo get_template_directory_uri(); ?>/assets/images/blockchain.svg" alt="">
  <img class="blockchain-circle" src="<?php echo get_template_directory_uri(); ?>/assets/images/bg-circle.webp" alt="">
  <div class="container">
    <div class="blockchain-block">
      <h2><?php the_field("blockchain-title"); ?></h2>
      <div class="block-chain-block__list">
        <?php the_field("blockchain-list"); ?>
      </div>
      <div class="block-chain-block__text">
        <?php the_field("blockchain-text"); ?>
      </div>
      <?php get_template_part("template-parts/buttons/ticket-button"); ?>
    </div>
  </div>
</section>