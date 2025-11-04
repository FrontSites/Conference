<?php
// Показываем блок только в админке WordPress
if (is_admin()) : ?>

  <section class="app">
    <div class="container">
      <div class="app-block">
        <h2><?php the_field("app-title"); ?></h2>
        <div class="app-block__description">
          <?php the_field("app-description"); ?>
        </div>
        <div class="app-block__content">
          <?php the_field("app-content"); ?>
        </div>
      </div>
    </div>
  </section>

<?php endif; ?>