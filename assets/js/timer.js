(function($) {
    'use strict';

    class ConferenceTimer {
        constructor() {
            this.timerElement = $('#conference-timer');
            this.daysElement = $('#timer-days');
            this.hoursElement = $('#timer-hours');
            this.minutesElement = $('#timer-minutes');
            this.secondsElement = $('#timer-seconds');
            this.interval = null;
            this.endTime = 0;
            this.isPaused = false;
            this.isEnabled = false;
            this.isHidden = false;
            this.serverTimeOffset = 0;
            
            this.init();
        }

        init() {
            if (this.timerElement.length === 0) {
                return;
            }

            this.loadTimerData();
            this.startTimer();
        }

        loadTimerData() {
            $.ajax({
                url: timer_ajax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_timer_data',
                    nonce: timer_ajax.nonce
                },
                success: (response) => {
                    if (response.success) {
                        const data = response.data;
                        this.isEnabled = data.enabled;
                        this.isPaused = data.paused;
                        this.isHidden = data.hidden;
                        this.endTime = data.endTimestamp * 1000; // Конвертируем в миллисекунды
                        
                        // Вычисляем разницу между серверным и клиентским временем
                        const serverTime = data.timeLeft;
                        const clientTime = Math.max(0, this.endTime - Date.now());
                        this.serverTimeOffset = clientTime - serverTime;
                        
                        // Обновляем цены
                        this.updatePrices(data);
                        
                        // Проверяем статус таймера
                        if (!this.isEnabled || this.isHidden) {
                            this.hideTimer();
                            return;
                        }
                        
                        if (data.expired) {
                            this.hideTimer();
                            return;
                        }
                        
                        this.showTimer();
                        this.updateDisplay();
                    }
                },
                error: (xhr, status, error) => {
                    console.error('Ошибка загрузки данных таймера:', error);
                }
            });
        }

        updatePrices(data) {
            // Обновляем цены в таймере
            $('.timer-prices .price-block__old-price').html(data.oldPrice);
            $('.timer-prices .price-block__new-price').html(data.newPrice);
            $('.timer-prices .price-block__discount').html(data.discount);
            $('.timer-prices .price-block__small-label').html(data.smallLabel);
        }

        startTimer() {
            if (this.interval) {
                clearInterval(this.interval);
            }

            this.interval = setInterval(() => {
                if (!this.isPaused && this.isEnabled && !this.isHidden) {
                    this.updateDisplay();
                }
            }, 1000);
        }

        updateDisplay() {
            const now = Date.now() + this.serverTimeOffset;
            const timeLeft = Math.max(0, this.endTime - now);

            if (timeLeft <= 0) {
                this.hideTimer();
                return;
            }

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            this.daysElement.text(days.toString().padStart(2, '0'));
            this.hoursElement.text(hours.toString().padStart(2, '0'));
            this.minutesElement.text(minutes.toString().padStart(2, '0'));
            this.secondsElement.text(seconds.toString().padStart(2, '0'));
        }

        showTimer() {
            this.timerElement.show();
        }

        hideTimer() {
            this.timerElement.hide();
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }

        destroy() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    }

    // Инициализация таймера при загрузке страницы
    $(document).ready(function() {
        window.conferenceTimer = new ConferenceTimer();
    });

    // Обработка видимости страницы для точности таймера
    document.addEventListener('visibilitychange', function() {
        if (window.conferenceTimer && !document.hidden) {
            // При возвращении на страницу обновляем данные таймера
            window.conferenceTimer.loadTimerData();
        }
    });

    // Обработка фокуса окна для синхронизации времени
    window.addEventListener('focus', function() {
        if (window.conferenceTimer) {
            window.conferenceTimer.loadTimerData();
        }
    });

})(jQuery);
