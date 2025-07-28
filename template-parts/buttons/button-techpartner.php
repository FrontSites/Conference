<a href="#" class="main-button _border">
  <img src="<?php echo get_template_directory_uri(); ?>/assets/images/hand.svg" alt="description">
  <?php
  if (function_exists('the_field')) {
    the_field("button_techpartner_text", "option");
  } else {
    echo 'Tech Partner';
  }
  ?>
</a>