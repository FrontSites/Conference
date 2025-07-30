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
          <img src="<?php echo $speaker["image"]; ?>" alt="<?php echo $speaker["name"]; ?>">
        </div>
      <?php } ?>
    </div>
  </div>
</section>