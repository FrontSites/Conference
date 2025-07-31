<section class="location">
  <div class="container">
    <h2><?php the_field('location-title'); ?></h2>
    <div class="location-wrapper">
      <div id="map" class="google-map"></div>
      <div class="location-block">
        <a href="/#rent" class="location-item">
          <div class="hero-image">
            <img src="<?php the_field("location-image"); ?>" alt="">
          </div>
          <div class="circle-button__wrap">
            <div class="circle-button">
              <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.8194 43.891C38.7721 45.8436 41.9379 45.8436 43.8905 43.891C45.8431 41.9384 45.8431 38.7726 43.8905 36.8199L36.8194 43.891ZM4.99964 0.000127192C2.23822 0.000127075 -0.000357993 2.2387 -0.000358109 5.00013L-0.000360006 50.0001C-0.000360122 52.7616 2.23822 55.0001 4.99964 55.0001C7.76106 55.0001 9.99964 52.7616 9.99964 50.0001L9.99964 10.0001L49.9996 10.0001C52.7611 10.0001 54.9996 7.76155 54.9996 5.00013C54.9996 2.23871 52.7611 0.000129205 49.9996 0.000129088L4.99964 0.000127192ZM40.355 40.3555L43.8905 36.8199L8.53518 1.46459L4.99964 5.00013L1.46411 8.53566L36.8194 43.891L40.355 40.3555Z" fill="#222649" />
              </svg>

            </div>
          </div>
          <div class="hero-location">
            <svg width="20" height="27" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.05469 9.10352C1.70091 3.21225 7.90744 -0.518108 13.2939 1.60156L13.5498 1.70703C18.8451 3.98876 20.6999 10.9303 17.2383 15.5977L10.0234 25.3223L2.80859 15.5977L2.80664 15.5967L2.55859 15.2451C1.44015 13.5802 0.892692 11.5498 1.01758 9.53516L1.05469 9.10352Z" stroke="#222649" stroke-width="2" />
            </svg>


            <?php the_field("hero-location"); ?>
          </div>
          <div class="hero-time">
            <?php the_field("hero-time"); ?>
          </div>
        </a>
      </div
        </div>
    </div>
</section>