<section class="app">
  <div class="container">
    <div class="app-items">
      <div class="app-item left">
        <div class="app-item__img">
          <img src="<?php the_field('app-image-top') ?>" alt="">
          <div class="app-image__text"><?php the_field("app-image-top-text"); ?></div>
        </div>
      </div>
      <div class="app-item right">
        <?php the_field("app-item-content"); ?>
        <div class="main-button__wrap">
          <a href="https://t.me/FullsetconfBot" target="_blank" class="main-button"><?php the_field("app-button-text"); ?></a>
          <div class="qr-code">
            <img src="<?php the_field("qr-code-image"); ?>" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="app-bottom__items">
      <div class="app-bottom__item left">
        <div class="app-bottom__item-text"><?php the_field("app-bottom-content"); ?></div>
      </div>
      <div class="app-bottom__item right">
        <div class="app-bottom__item-img">
          <img src="<?php the_field("app-bottom-image"); ?>" alt="">
        </div>
      </div>
    </div>

    <div class="main-button__wrap">
      <a href="https://t.me/FullsetconfBot" target="_blank" class="main-button"><?php the_field("app-button-text"); ?></a>
      <div class="qr-code">
        <img src="<?php the_field("qr-code-image"); ?>" alt="">
      </div>
    </div>
  </div>
</section>