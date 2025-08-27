</div>
</main>

<footer class="footer">
  <div class="footer-wrapper">
    <div class="container">
      <div class="footer-items">
        <div class="logo">
          <a href="<?php echo home_url(); ?>">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo-footer.svg" alt="logo">
          </a>
        </div>
        <div class="footer-links">
          <a href="mailto:<?php echo get_theme_mod('contact_email', ''); ?>">
            <?php echo get_theme_mod('contact_email', ''); ?>
          </a>
          <a href="https://t.me/FullsetconfBot" target="_blank">
            @FullsetconfBot
          </a>
        </div>

        <div class="footer-menu">
          <?php wp_nav_menu([
            'theme_location' => 'main-menu',

            'container'       => false,
            'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
            'menu_class'     => 'main-menu', // navbar-2nd_level
          ]);
          ?>
        </div>
        <div class="footer-item">
          <div class="footer-links">
            <a href="mailto:<?php echo get_theme_mod('contact_email', ''); ?>">
              <?php echo get_theme_mod('contact_email', ''); ?>
            </a>
            <a href="https://t.me/FullsetconfBot" target="_blank">
              @FullsetconfBot
            </a>
          </div>
          <?php get_template_part('template-parts/buttons/ticket-button'); ?>
        </div>

      </div>
    </div>

  </div>
  <a href="https://generis.agency/" class="footer-agency" target="_blank">Designed by
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/generis.svg" alt="footer-agency">
  </a>
</footer>
</div>
<?php get_template_part('template-parts/popup'); ?>
<script
  type="module"
  src="https://wc.ticketcrm.com/lib/tbx-widget.min.js"></script>

<script>
// Отслеживание кликов на кнопки покупки билетов
document.addEventListener('DOMContentLoaded', function() {
  // Функция для отправки события в DataLayer
  function sendTicketClickEvent() {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'click_buy_ticket'
      });
    }
  }

  // Обработчик кликов на кнопки с классом ticket
  document.addEventListener('click', function(event) {
    // Проверяем, является ли кликнутый элемент кнопкой ticket или его дочерним элементом
    const ticketButton = event.target.closest('.ticket');
    if (ticketButton) {
      sendTicketClickEvent();
    }
  });
});
</script>

<?php wp_footer(); ?>

</body>

</html>