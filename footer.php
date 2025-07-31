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


        <div class="footer-menu">
          <?php wp_nav_menu([
            'theme_location' => 'footer-site-menu',

            'container'       => false,
            'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
            'menu_class'     => 'main-menu', // navbar-2nd_level
          ]);
          ?>
        </div>

        <div class="footer-links">
          <a href="mailto:<?php echo get_theme_mod('contact_email', ''); ?></a>">
            <?php echo get_theme_mod('contact_email', ''); ?>
          </a>
          <a href="tel:<?php echo get_theme_mod('contact_phone', ''); ?>">
            <?php echo get_theme_mod('contact_phone', ''); ?>
          </a>
        </div>
        <?php get_template_part('template-parts/buttons/ticket-button'); ?>
      </div>
    </div>

  </div>
  <a href="https://agency.kiev.ua/" class="footer-agency">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/footer-agency.svg" alt="footer-agency">
  </a>
</footer>
</div>
<?php wp_footer(); ?>
</body>

</html>