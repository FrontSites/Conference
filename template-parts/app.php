<?php
// Показываем блок только в админке WordPress
if (is_admin()) : ?>

  <section class="app">
    <div class="container">
      <div class="app-items">
        <div class="app-item left">
          <div class="app-item__img">
            <img src="<? the_field('app-image-top') ?>" alt="">
            <div class="app-image__text"><?php the_field("app-image-top-text"); ?></div>
          </div>
        </div>
        <div class="app-item right">
          <?php the_field("app-item-content"); ?>
          <div class="main-button__wrap">
            <a href="https://t.me/FullsetconfBot" target="_blank" class="main-button"><?php the_field("app-button-text"); ?></a>
            .qr-code
          </div>
        </div>
      </div>
    </div>
  </section>

<?php endif; ?>