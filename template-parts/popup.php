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
        <path d="M19.2635 35.0226C18.2785 35.0226 17.2936 34.601 16.7307 33.7579L8.85086 23.64C7.72513 22.2347 8.00661 20.2674 9.41372 19.1431C10.8208 18.0189 12.7908 18.3 13.9165 19.7053L19.2635 26.5911L31.0834 11.2737C32.2092 9.86847 34.1791 9.58736 35.5862 10.7116C36.9933 11.8358 37.2748 13.8032 36.1491 15.2084L21.7964 33.7579C21.0928 34.4605 20.2486 35.0226 19.2635 35.0226Z" fill="#222649" />
      </svg>

      <a href="#" class="main-button _border"><?php the_field("popup-success-button"); ?></a>
    </div>
  </div>
</section>