<section class="speakers">
  <div class="container">
    <h2><?php the_field("speakers-title"); ?></h2>
    <p><?php the_field("speakers-subtitle"); ?></p>
    <div class="speakers-items">
      <?php $speakers = get_field("speakers-items");
      foreach ($speakers as $speaker) {
        $image = $speaker["speaker-image"];
        $name = $speaker["speaker-name"];
        $position = $speaker["speaker-position"];

      ?>
        <div class="speakers-item">
          <div class="speakers-item__image">
            <img src="<?php echo $image; ?>" alt="<?php echo $name; ?>">
          </div>
          <div class="speakers-item__name">
            <h3><?php echo $name; ?></h3>
          </div>
          <p><?php echo $position; ?></p>
        </div>
      <?php } ?>
    </div>
    <div class="load-more-button main-button">
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.7507 9.48211C3.87713 9.60854 4.0457 9.69282 4.21427 9.69282C4.38284 9.69282 4.55141 9.60854 4.67784 9.48211L7.83854 6.15283C8.00711 5.98426 8.00711 5.73141 7.83854 5.56284C7.66997 5.39427 7.41712 5.39427 7.24855 5.56284L4.6357 8.30211V0.421427C4.6357 0.168571 4.46713 0 4.21427 0C3.96142 0 3.79285 0.168571 3.79285 0.421427V8.30211L1.22214 5.56284C1.05357 5.39427 0.800713 5.39427 0.632143 5.56284C0.463572 5.73141 0.463572 5.98426 0.632143 6.15283L3.7507 9.48211Z" fill="white" />
      </svg>
      <span>Завантажити ще</span>



    </div>
  </div>
</section>