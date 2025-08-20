 <section class="hero">
   <div class="hero-background">
     <img src="<?php echo get_template_directory_uri(); ?>/assets/images/arrow-hero.svg" alt="description">

   </div>
   <div class="container">
     <div class="hero-items">
       <div class="hero-item left">
         <?php the_field("hero-title"); ?>
         <div class="hero-item__text">
           <?php the_field("hero-bottom-text"); ?>
         </div>
       </div>
       <a href="/#agenda" class="hero-item right">
         <div class="hero-image">
           <img src="<?php the_field("hero-image"); ?>" alt="">
         </div>
         <div class="circle-button__wrap">
           <div class="circle-button">
             <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M36.8199 43.891C38.7726 45.8436 41.9384 45.8436 43.891 43.891C45.8436 41.9384 45.8436 38.7726 43.891 36.8199L36.8199 43.891ZM5.00013 0.000127192C2.23871 0.000127075 0.000130288 2.2387 0.000130172 5.00013L0.000128275 50.0001C0.000128159 52.7616 2.2387 55.0001 5.00013 55.0001C7.76155 55.0001 10.0001 52.7616 10.0001 50.0001L10.0001 10.0001L50.0001 10.0001C52.7616 10.0001 55.0001 7.76155 55.0001 5.00013C55.0001 2.23871 52.7616 0.000129205 50.0001 0.000129088L5.00013 0.000127192ZM40.3555 40.3555L43.891 36.8199L8.53566 1.46459L5.00013 5.00013L1.4646 8.53566L36.8199 43.891L40.3555 40.3555Z" fill="white" />
             </svg>
           </div>
         </div>
         <div class="hero-location">
           <svg width="20" height="27" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M1.05469 9.10352C1.70091 3.21225 7.90744 -0.518108 13.2939 1.60156L13.5498 1.70703C18.8451 3.98876 20.6999 10.9303 17.2383 15.5977L10.0234 25.3223L2.80859 15.5977L2.80664 15.5967L2.55859 15.2451C1.44015 13.5802 0.892692 11.5498 1.01758 9.53516L1.05469 9.10352Z" stroke="white" stroke-width="2" />
           </svg>

           <?php the_field("hero-location"); ?>
         </div>
         <div class="hero-time">
           <?php the_field("hero-time"); ?>
         </div>
       </a>
     </div>
     <div class="hero-bottom">
       <div class="hero-item__text">
         <?php the_field("hero-bottom-text"); ?>
       </div>
       <div class="hero-list">
         <?php the_field("hero-list"); ?>
       </div>

     </div>
   </div>

 </section>