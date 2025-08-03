<a href="#" class="main-button _border popup-btn">
  <img src="<?php echo get_template_directory_uri(); ?>/assets/images/hand.svg" alt="description">
  <?php
  if (function_exists('the_field')) {
    the_field("sponsor_button_text", "option");
  } else {
    echo 'Sponsor';
  }
  ?>
</a>