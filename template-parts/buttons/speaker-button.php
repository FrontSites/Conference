<a href="#" class="main-button _border">
  <img src="<?php echo get_template_directory_uri(); ?>/assets/images/micro.svg" alt="description">
  <?php
  if (function_exists('the_field')) {
    the_field("speaker_button_text", "option");
  } else {
    echo 'Speaker';
  }
  ?>
</a>