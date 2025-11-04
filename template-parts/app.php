<?php
// Показываем блок только в админке WordPress
if (is_admin()) : ?>

  <section class="app">
    <div class="container">
      <div class="app-items">
        <div class="app-item left">
          <div class="app-item__img">
            <img src="<? the_field('app-image-top') ?>" alt="">
            .app-image__text
          </div>
        </div>
        <div class="app-item right"></div>
      </div>
    </div>
  </section>

<?php endif; ?>