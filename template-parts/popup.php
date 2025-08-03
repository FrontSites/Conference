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
  </div>
</section>