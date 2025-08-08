<?php

/**
 * Шаблон таймера конференции
 * Используется для отображения обратного отсчета до окончания акции
 */

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
?>

<div id="conference-timer" class="conference-timer">
    <div class="timer-container">
        <div class="timer-title">Встигни купити вигідно</div>
        <div class="timer-display">
            <div class="timer-unit">
                <span class="timer-number" id="timer-days">00</span>
                <span class="timer-label" id="timer-days-label">днів</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-unit">
                <span class="timer-number" id="timer-hours">00</span>
                <span class="timer-label" id="timer-hours-label">годин</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-unit">
                <span class="timer-number" id="timer-minutes">00</span>
                <span class="timer-label" id="timer-minutes-label">хвилин</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-unit">
                <span class="timer-number" id="timer-seconds">00</span>
                <span class="timer-label" id="timer-seconds-label">секунд</span>
            </div>
        </div>
    </div>
</div>