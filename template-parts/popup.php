<section class="popup-wrapper">
  <div class="popup">
    <div class="close-button"><svg width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M38.5114 0.741868L1.74185 37.5114M37.7972 37.5114L1.02767 0.741866" stroke="white" />
      </svg>
    </div>
    <div class="popup-wrapper__top">
      <h2><?php the_field("popup-title"); ?></h2>
    </div>
    <?php echo do_shortcode('[contact-form-7 id="542cab5" title="Попап"]'); ?>
    <div class="popup-success">
      <h3><?php the_field("popup-success-title"); ?></h3>
      <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40.0891 40.7842C33.1942 46.4053 11.6651 46.4053 4.9109 40.7842C-1.98402 35.1631 -1.28047 11.1331 4.9109 4.80942C11.1023 -1.51427 33.8977 -1.51427 40.0891 4.80942C46.2805 11.1331 46.984 35.1632 40.0891 40.7842Z" fill="#F7E405" />
      </svg>
      <a href="#" class="main-button _border"><?php the_field("popup-success-button"); ?></a>
    </div>
  </div>
</section>