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
    <div class="load-more">
      <div class="main-button">
        <span>Завантажити ще</span>

        </d>
      </div>
    </div>
</section>