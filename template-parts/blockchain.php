<section class="blockchain">
  <img src="<?php echo get_template_directory_uri(); ?>/assets/images/blockchain.svg" alt="">
  <div class="container">
    <div class="block-chain-block">
      <?php the_field("blockchain-title"); ?>
      <div class="block-chain-block__list">
        <?php the_field("blockchain-list"); ?>
      </div>
      <div class="block-chain-block__text">
        <?php the_field("blockchain-text"); ?>
      </div>
      <?php get_template_part("template-parts/ticket-button"); ?>
    </div>
  </div>
</section>