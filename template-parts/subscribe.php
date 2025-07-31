<section class="subscribe-block">
  <div class="container">
    <div class="subscribe-items">
      <div class="subscribe-item left">
        <h2><?php the_field("subscribe_title"); ?></h2>
        <p><?php the_field("subscribe_subtitle"); ?></p>
      </div>
      <div class="subscribe-item right">
        <?php $social_networks = ['instagram', 'facebook', 'twitter', 'telegram', 'youtube',]; ?>
        <ul>
          <?php foreach ($social_networks as $network) {
            $url = get_theme_mod("{$network}_url");
            $name = get_theme_mod("{$network}_name");
            $icon = get_theme_mod("{$network}_icon");

            // Если URL установлен, выводим социальную сеть
            if ($url) : ?>
              <li>
                <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer">
                  <?php if ($icon) : ?>
                    <img src="<?php echo esc_url($icon); ?>" alt="<?php echo esc_attr($name); ?> Icon" />
                  <?php else : ?>
                    <?php echo esc_html($name); ?>
                  <?php endif; ?>
                </a>
              </li>
            <?php endif; ?>
          <?php } ?>
        </ul>

      </div>
    </div>

  </div>
</section>

<div class="form-items">
  <div class="form-item">
    <input type="text" placeholder="Name">
  </div>
 
</div>