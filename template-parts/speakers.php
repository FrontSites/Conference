<section class="speakers" id="speakers">
  <div class="container">
    <h2><?php the_field("speakers-title"); ?></h2>
    <p><?php the_field("speakers-subtitle"); ?></p>
    <div class="speakers-items">
      <?php $speakers = get_field("speakers-items");
      foreach ($speakers as $speaker) {
        $image = $speaker["speaker-image"];
        $name = $speaker["speaker-name"];
        $position = $speaker["speaker-position"];
        $label = isset($speaker["speaker-label"]) ? trim($speaker["speaker-label"]) : '';
      ?>
        <div class="speakers-item">
          <div class="speakers-item__image">
            <img src="<?php echo $image; ?>" alt="<?php echo $name; ?>">
          </div>
          <div class="speakers-item__name">
            <h3><?php echo $name; ?></h3>
            <a href="<?php echo $speaker["speaker-link"]; ?>" class="icon" target="_blank">
              <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.59805 15H0.198044V4.96875H3.59805V15ZM1.89805 3.5625C0.798048 3.5625 -0.00195312 2.8125 -0.00195312 1.78125C-0.00195312 0.75 0.898048 0 1.89805 0C2.99805 0 3.79805 0.75 3.79805 1.78125C3.79805 2.8125 2.99805 3.5625 1.89805 3.5625ZM15.998 15H12.5981V9.5625C12.5981 7.96875 11.898 7.5 10.898 7.5C9.89804 7.5 8.89804 8.25 8.89804 9.65625V15H5.49805V4.96875H8.69804V6.375C8.99804 5.71875 10.198 4.6875 11.898 4.6875C13.798 4.6875 15.798 5.71875 15.798 8.8125V15H15.998Z" fill="white" />
              </svg>

            </a>
          </div>
          <p><?php echo $position; ?></p>
          <?php if ($label !== ''): ?>
            <div class="speaker-label"><?php echo $label; ?></div>
          <?php endif; ?>
        </div>
      <?php } ?>
    </div>
    <?php
    // Получаем текущий язык
    $lang_id = 'uk'; // По умолчанию украинский
    if (function_exists('pll_current_language')) {
      $lang_id = pll_current_language('slug');
    } elseif (function_exists('icl_object_id')) {
      $lang_id = ICL_LANGUAGE_CODE;
    }
    $load_more_text = $lang_id === 'en' ? 'Load more' : 'Завантажити ще';
    $hide_text = $lang_id === 'en' ? 'Less more' : 'Сховати';
    ?>

    <div class="load-more-button main-button" data-lang="<?php echo $lang_id; ?>" data-hide="<?php echo $hide_text; ?>">
      <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d=" M3.7507 9.48211C3.87713 9.60854 4.0457 9.69282 4.21427 9.69282C4.38284 9.69282 4.55141 9.60854 4.67784 9.48211L7.83854 6.15283C8.00711 5.98426 8.00711 5.73141 7.83854 5.56284C7.66997 5.39427 7.41712 5.39427 7.24855 5.56284L4.6357 8.30211V0.421427C4.6357 0.168571 4.46713 0 4.21427 0C3.96142 0 3.79285 0.168571 3.79285 0.421427V8.30211L1.22214 5.56284C1.05357 5.39427 0.800713 5.39427 0.632143 5.56284C0.463572 5.73141 0.463572 5.98426 0.632143 6.15283L3.7507 9.48211Z" fill="white" />
        <path class="line" d="M8.00711 10.957H0.421427C0.168571 10.957 0 11.1256 0 11.3785C0 11.6313 0.168571 11.7999 0.421427 11.7999H8.00711C8.25997 11.7999 8.42854 11.6313 8.42854 11.3785C8.42854 11.1256 8.25997 10.957 8.00711 10.957Z" fill="white" />
      </svg>

      <span><?php echo $load_more_text; ?></span>
    </div>
    <?php get_template_part("template-parts/buttons/speaker-button"); ?>
  </div>
</section>