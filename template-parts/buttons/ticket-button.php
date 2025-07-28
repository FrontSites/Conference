<a href="#" class="main-button ticket">
  <img src="<?php echo get_template_directory_uri(); ?>/assets/images/ticket.svg" alt="description">
  <?php 
  if (function_exists('the_field')) {
    the_field("ticket_button_text", "option");
  } else {
    echo 'Buy Ticket';
  }
  ?>
</a>