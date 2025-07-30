<?php
/*
Template Name: Home
*/
?>
<?php get_header(); ?>

<main>
  <?php get_template_part('template-parts/hero'); ?>
  <div class="main-content">
    <?php get_template_part('template-parts/blockchain'); ?>
    <?php get_template_part('template-parts/speakers'); ?>
    <?php get_template_part('template-parts/schedule'); ?>
    <?php get_template_part('template-parts/fullset'); ?>
    <?php get_template_part('template-parts/partners'); ?>
    <?php get_template_part('template-parts/price'); ?>
    <?php get_template_part('template-parts/partners-media'); ?>
    <?php get_template_part('template-parts/partners-tech'); ?>
<?php get_template_part('template-parts/location'); ?>
<?php get_template_part('template-parts/map'); ?>



    <?php get_footer() ?>