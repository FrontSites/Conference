<section class="speakers">
  <div class="container">
    <h2><?php the_field("speakers-title"); ?></h2>

    <div class="speakers-items">
      <?php $speakers = get_field("speakers-items");
      foreach ($speakers as $speaker) {
        $image = $speaker["image"];
        $name = $speaker["name"];
        $position = $speaker["position"];

      ?>
        <div class="speakers-item">
          <div class="speakers-item__image">
            <img src="<?php echo $image; ?>" alt="<?php echo $name; ?>">
          </div>
          <div class="speakers-item__name">
            <h3><?php echo $name; ?></h3>
            <p><?php echo $position; ?></p>
          </div>
        </div>
      <?php } ?>
    </div>
  </div>
</section>