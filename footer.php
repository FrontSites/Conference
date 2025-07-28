</main>

<footer class="footer">
  <div class="container">
    <?php 
    if (has_nav_menu('footer-site-menu')) {
      wp_nav_menu([
        'theme_location' => 'footer-site-menu',
        'container'       => false,
        'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
        'menu_class'     => 'footer-menu',
      ]);
    }
    ?>
  </div>
</footer>
</div>
<?php 
error_log('Footer.php: before wp_footer()');
wp_footer(); 
error_log('Footer.php: after wp_footer()');
?>
</body>

</html>