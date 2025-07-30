<section class="schedule">
  <div class="container">
    <div class="schedule-items">
      <?php $schedule = get_field("schedule"); 

      foreach ($schedule as $item) {
        $title = $item["schedule-text"];
        $time = $item["time"];
        ?>
        <div class="schedule-item">
          <div class="schedule-item-title">
            <?php echo $item["title"]; ?>
          </div>
        </div>
        <?php
      }
    </div>
  </div>
</section>