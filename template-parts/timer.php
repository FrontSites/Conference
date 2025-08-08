<?php
// Проверяем, включен ли таймер
$timer_enabled = get_option('timer_enabled', 0);
$timer_hidden = get_option('timer_hidden', 0);

if (!$timer_enabled || $timer_hidden) {
    return;
}

// Получаем настройки таймера
$timer_old_price = get_option('timer_old_price', '<span>299</span>');
$timer_new_price = get_option('timer_new_price', '<span>199</span>');
$timer_discount = get_option('timer_discount', '<span>-33%</span>');
$timer_small_label = get_option('timer_small_label', '<span>Экономия</span>');

// Языковой заголовок таймера
$current_lang = 'uk';
if (function_exists('pll_current_language')) {
    $current_lang = pll_current_language();
} elseif (defined('ICL_LANGUAGE_CODE')) {
    $current_lang = ICL_LANGUAGE_CODE;
}
$suffix = '_' . $current_lang;
$default_titles = [
    'uk' => 'До кінця акції залишилось:',
    'en' => 'Time until promotion ends:',
];
$timer_title = get_option('timer_title' . $suffix, $default_titles[$current_lang] ?? $default_titles['uk']);
?>

<div id="conference-timer" class="conference-timer">
    <div class="timer-container">
        <h3><?php echo esc_html($timer_title); ?></h3>
        <div class="timer-display">
            <div class="timer-unit">
                <span class="timer-number" id="timer-days">00</span>
                <span class="timer-label" id="timer-days-label">днів</span>
            </div>
            <div class="timer-unit">
                <span class="timer-number" id="timer-hours">00</span>
                <span class="timer-label" id="timer-hours-label">годин</span>
            </div>
            <div class="timer-unit">
                <span class="timer-number" id="timer-minutes">00</span>
                <span class="timer-label" id="timer-minutes-label">хвилин</span>
            </div>
            <div class="timer-unit">
                <span class="timer-number" id="timer-seconds">00</span>
                <span class="timer-label" id="timer-seconds-label">секунд</span>
            </div>
        </div>
    </div>
</div>
<script>
  window.addEventListener('load', function () {
    var $ = window.jQuery;
    var $timer = $('#conference-timer');
    if (!$ || !$timer.length || typeof window.timer_ajax === 'undefined') return;

    $.post(window.timer_ajax.ajaxurl, { action: 'get_timer_data', nonce: window.timer_ajax.nonce })
      .done(function (resp) {
        if (!resp || !resp.success || !resp.data) return;
        if (resp.data.expired) {
          $timer.addClass('hidden');
        }
      });
  });
  </script>