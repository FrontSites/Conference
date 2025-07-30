</div>
</main>

<footer class="footer">
  <div class="container">
    <?php wp_nav_menu([
      'theme_location' => 'footer-site-menu',

      'container'       => false,
      'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
      'menu_class'     => 'footer-menu', // navbar-2nd_level
    ]);
    ?>
  </div>
</footer>
</div>
<?php wp_footer(); ?>
</body>

</html>