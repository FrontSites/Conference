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
        <?php $price_old_price = $price['price-old-price']; ?>
        <?php $price_new_price = $price['price-new-price']; ?>
        <?php $price_small_label = $price['price-small-label']; ?>
        <?php $price_discount = $price['price-discount']; ?>



        <div class="price-item__wrapper">
          <div class="price-item">
            <h3><?php echo $price['title']; ?></h3>
            <p><?php echo $description['description']; ?></p>
            <div class="price-block">
              <div class="price-block__item left">
                <div class="price-block__old-price">
                  <?php echo $price_old_price['price-old-price']; ?>
                </div>
                <div class="price-block__new-price">
                  <?php echo $price_new_price['price-new-price']; ?>
                </div>
              </div>
              <div class="price-block__item right">

              </div>
              <?php get_template_part('template-parts/buttons/ticket-button'); ?>

            </div>


          </div>

        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>