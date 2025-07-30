<section class="price">
  <div class="container">
    <h2>
      <?php the_field('price-title'); ?>
    </h2>
    <div class="price-items">
      <?php $prices = get_field('price-items'); ?>
      <?php foreach ($prices as $price) : ?>
        <?php $title = $price['price-item-title']; ?>
        <?php $description = $price['price-description']; ?>
        <?php $price = $price['price-old-price']; ?>
        <?php $price = $price['price-new-price']; ?>

        <div class="price-item__wrapper">
          <div class="price-item">
            <h3><?php echo $price['title']; ?></h3>
            <p><?php echo $price['description']; ?></p>
          </div>
        </div>

      <?php endforeach; ?>
    </div>
  </div>
</section>