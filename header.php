<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Permissions-Policy" content="interest-cohort=()" />
  <?php
  // Получить заголовок SEO Yoast
  $yoast_title = get_post_meta(get_the_ID(), '_yoast_wpseo_title', true);

  // Если заголовок SEO Yoast не задан, используйте стандартный заголовок WordPress
  if (empty($yoast_title)) {
    $yoast_title = get_the_title();
  }

  // Вывести заголовок в тег <title>
  echo '<title>' . esc_html($yoast_title) . '</title>';
  ?>
  <?php wp_head(); ?>
</head>

<body id="page-<?php echo esc_attr(get_post_field('post_name', get_post())); ?>" <?php body_class(); ?>>
  <div class="page__wrapper">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-block">
          <div class="btn_nav">
            <div class="burger">
              <div class="line top"></div>
              <div class="line middle"></div>
              <div class="line bottom"></div>
            </div>
          </div>
          <div class="languages-menu">
            <?php wp_nav_menu([
              'theme_location' => 'languages-menu',

              'container'       => false,
              'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
              'menu_class'     => 'languages-menu', // navbar-2nd_level
            ]);
            ?>
          </div>
          <div class="header-wrapper">

            <?php wp_nav_menu([
              'theme_location' => 'header-menu',

              'container'       => false,
              'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
              'menu_class'     => 'main-menu', // navbar-2nd_level
            ]);
            ?>
          </div>
          <a href="/" class="logo"><img src="<?php echo get_template_directory_uri() ?>/assets/images/logo.svg" alt="logo"></a>
          <div class="header-buttons">
            <?php get_template_part('template-parts/buttons/ticket-button'); ?>
            <?php get_template_part('template-parts/buttons/sponsor-button'); ?>
          </div>


        </div>


      </div>

    </header>