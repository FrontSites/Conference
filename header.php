<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Permissions-Policy" content="interest-cohort=()" />
  <meta name="description" content="Join the Web3 Conference 2025 in Ukraine — blockchain, NFT technologies. Inspiring speakers and exciting program. Register now!">

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content=" ">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Web3 Conference in Ukraine 2025 | Fullset Blockchain Conference">
  <meta property="og:description" content="Join the Web3 Conference 2025 in Ukraine — blockchain, NFT technologies. Inspiring speakers and exciting program. Register now!">
  <meta property="og:image" content="">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta property="twitter:domain" content="">
  <meta property="twitter:url" content="/">
  <meta name="twitter:title" content="Web3 Conference in Ukraine 2025 | Fullset Blockchain Conference">
  <meta name="twitter:description" content="Join the Web3 Conference 2025 in Ukraine — blockchain, NFT technologies. Inspiring speakers and exciting program. Register now!">

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

<body id="page-<?php echo esc_attr(get_post_field('post_name', get_post())); ?>" class="lang-<?php echo esc_attr(substr(get_locale(), 0, 2)); ?>" <?php body_class(); ?>>
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
              'menu_class'     => 'language-menu', // navbar-2nd_level
            ]);
            ?>
          </div>
          <div class="header-wrapper">
            <div class="languages-menu">

              <?php wp_nav_menu([
                'theme_location' => 'languages-menu',

                'container'       => false,
                'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                'menu_class'     => 'language-menu', // navbar-2nd_level
              ]);
              ?>
            </div>
            <?php wp_nav_menu([
              'theme_location' => 'header-menu',

              'container'       => false,
              'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
              'menu_class'     => 'main-menu', // navbar-2nd_level
            ]);
            ?>

            <?php get_template_part('template-parts/buttons/sponsor-button'); ?>
          </div>
          <a href="/" class="logo"><img src="<?php echo get_template_directory_uri() ?>/assets/images/logo.svg" alt="logo"></a>
          <div class="header-buttons">
            <?php get_template_part('template-parts/buttons/ticket-button'); ?>
            <?php get_template_part('template-parts/buttons/sponsor-button'); ?>
          </div>


        </div>


      </div>

    </header>