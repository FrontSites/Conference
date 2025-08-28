<section class="afterparty">
  <div class="container">
    <h2><?php the_field("afterparty-title"); ?></h2>
    <p><?php the_field("afterparty-subtitle"); ?></p>
    <div class="afterparty-items">
      <?php $block = get_field('afterparty_items'); ?>
      <?php foreach ($block as $item) : ?>
        <div class="afterparty-item__wrapper">
          <div class="afterparty-item">
            <div class="afteparty-image"><img src="<?php echo $item['afterparty-image']; ?>" alt=""></div>
            <h3 class="afterparty-item-title"><?php echo $item['afterparty-item-title']; ?></h3>
            <p class="afterparty-item-description"><?php echo $item['afterparty-description']; ?></p>
          </div>
        </div>
      <?php endforeach; ?>

    </div>
  </div>
</section>