<section class="partners">
  <div class="container">
    <h2><?php the_field('partners-title'); ?></h2>
    <p><?php the_field('partners-subtitle'); ?></p>
    <div class="partners-items">
      <?php $partners = get_field('partners-items'); ?>
      <?php foreach ($partners as $partner) : ?>
        <div class="partners-item">
          <img src="<?php echo $partner['image']['url']; ?>" alt="<?php echo $partner['partner-image']['alt']; ?>">
        </div>
      <?php endforeach; ?>
    </div>

  </div>
</section>