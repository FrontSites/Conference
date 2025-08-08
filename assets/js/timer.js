(function($) {
    'use strict';

    class ConferenceTimer {
        constructor() {
            console.log('ConferenceTimer constructor called');
            this.timerElement = $('#conference-timer');
            this.daysElement = $('#timer-days');
            this.hoursElement = $('#timer-hours');
            this.minutesElement = $('#timer-minutes');
            this.secondsElement = $('#timer-seconds');
            this.daysLabelElement = $('#timer-days-label');
            this.hoursLabelElement = $('#timer-hours-label');
            this.minutesLabelElement = $('#timer-minutes-label');
            this.secondsLabelElement = $('#timer-seconds-label');
            this.pricesElement = $('#timer-prices');
            this.interval = null;
            this.endTime = 0;
            this.isPaused = false;
            this.isEnabled = false;
            this.isHidden = false;
            this.serverTimeOffset = 0;
            this.labels = window.timerLabels || {
                days: ['день', 'дня', 'днів'],
                hours: ['година', 'години', 'годин'],
                minutes: ['хвилина', 'хвилини', 'хвилин'],
                seconds: ['секунда', 'секунди', 'секунд']
            };
            
            console.log('Timer elements found:', {
                timer: this.timerElement.length,
                days: this.daysElement.length,
                hours: this.hoursElement.length,
                minutes: this.minutesElement.length,
                seconds: this.secondsElement.length,
                prices: this.pricesElement.length
            });
            
            this.init();
        }

        init() {
            if (this.timerElement.length === 0) {
                console.log('Timer element not found');
                return;
            }

            console.log('Initializing timer...');
            this.loadTimerData();
            this.startTimer();
        }

        loadTimerData() {
            console.log('Loading timer data...');
            
            // Проверяем, есть ли timer_ajax
            if (typeof timer_ajax === 'undefined') {
                console.error('timer_ajax is not defined');
                return;
            }
            
            $.ajax({
                url: timer_ajax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_timer_data',
                    nonce: timer_ajax.nonce
                },
                success: (response) => {
                    console.log('Timer data loaded:', response);
                    console.log('Response success:', response.success);
                    console.log('Response data:', response.data);
                    
                    if (response.success && response.data) {
                        const data = response.data;
                        this.isEnabled = data.enabled;
                        this.isPaused = data.paused;
                        this.isHidden = data.hidden;
                        this.endTime = data.endTimestamp * 1000; // Конвертируем в миллисекунды
                        this.labels = data.labels || this.labels;
                        
                        // Обновляем заголовок таймера
                        if (data.texts && data.texts.title) {
                            $('.timer-title').text(data.texts.title);
                        }
                        
                        console.log('Timer status:', {
                            enabled: this.isEnabled,
                            paused: this.isPaused,
                            hidden: this.isHidden,
                            endTime: this.endTime,
                            currentTime: Date.now()
                        });
                        
                        // Вычисляем разницу между серверным и клиентским временем
                        const serverTime = data.timeLeft;
                        const clientTime = Math.max(0, this.endTime - Date.now());
                        this.serverTimeOffset = clientTime - serverTime;
                        
                        // Обновляем цены
                        this.updatePrices(data);
                        
                        // Проверяем статус таймера
                        if (!this.isEnabled || this.isHidden) {
                            console.log('Timer is disabled or hidden');
                            this.hideTimer();
                            return;
                        }
                        
                        if (data.expired) {
                            console.log('Timer has expired');
                            this.hideTimer();
                            return;
                        }
                        
                        this.showTimer();
                        this.updateDisplay();
                    } else {
                        console.error('Timer data response was not successful');
                    }
                },
                error: (xhr, status, error) => {
                    console.error('Ошибка загрузки данных таймера:', error);
                    console.error('Status:', status);
                    console.error('Response:', xhr.responseText);
                }
            });
        }

        updatePrices(data) {
            console.log('Updating prices with data:', data);
            
            // Создаем HTML для цен
            let pricesHtml = '';
            
            // REGULAR билет
            pricesHtml += `
                <div class="price-block__item left">
                    <div class="price-block__old-price">
                        ${data.regular.oldPrice}
                    </div>
                    <div class="price-block__new-price">
                        ${data.regular.newPrice}
                    </div>
                </div>
                <div class="price-block__item right">
                    <div class="price-block__small-label">
                        ${data.regular.smallLabel}
                    </div>
                    <div class="price-block__discount">
                        ${data.regular.discount}
                    </div>
                </div>
            `;
            
            // VIP билет
            pricesHtml += `
                <div class="price-block__item left">
                    <div class="price-block__old-price">
                        ${data.vip.oldPrice}
                    </div>
                    <div class="price-block__new-price">
                        ${data.vip.newPrice}
                    </div>
                </div>
                <div class="price-block__item right">
                    <div class="price-block__small-label">
                        ${data.vip.smallLabel}
                    </div>
                    <div class="price-block__discount">
                        ${data.vip.discount}
                    </div>
                </div>
            `;
            
            this.pricesElement.html(pricesHtml);
            console.log('Prices updated');
        }

        startTimer() {
            if (this.interval) {
                clearInterval(this.interval);
            }

            console.log('Starting timer interval');
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
                console.log('Time left is 0, hiding timer');
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

            // Обновляем подписи с правильными окончаниями
            this.daysLabelElement.text(this.getTimeLabel(days, this.labels.days));
            this.hoursLabelElement.text(this.getTimeLabel(hours, this.labels.hours));
            this.minutesLabelElement.text(this.getTimeLabel(minutes, this.labels.minutes));
            this.secondsLabelElement.text(this.getTimeLabel(seconds, this.labels.seconds));
        }

        getTimeLabel(number, labels) {
            // Для английского языка
            if (labels[0] === 'day' || labels[0] === 'hour' || labels[0] === 'minute' || labels[0] === 'second') {
                return number === 1 ? labels[0] : labels[1];
            }
            
            // Для украинского языка
            if (number >= 11 && number <= 19) {
                return labels[2]; // днів, годин, хвилин, секунд
            }
            
            const lastDigit = number % 10;
            if (lastDigit === 1) {
                return labels[0]; // день, година, хвилина, секунда
            } else if (lastDigit >= 2 && lastDigit <= 4) {
                return labels[1]; // дня, години, хвилини, секунди
            } else {
                return labels[2]; // днів, годин, хвилин, секунд
            }
        }

        showTimer() {
            console.log('Showing timer');
            this.timerElement.show();
        }

        hideTimer() {
            console.log('Hiding timer');
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
        console.log('Document ready, initializing conference timer...');
        window.conferenceTimer = new ConferenceTimer();
    });

    // Обработка видимости страницы для точности таймера
    document.addEventListener('visibilitychange', function() {
        if (window.conferenceTimer && !document.hidden) {
            console.log('Page became visible, reloading timer data');
            window.conferenceTimer.loadTimerData();
        }
    });

    // Обработка фокуса окна для синхронизации времени
    window.addEventListener('focus', function() {
        if (window.conferenceTimer) {
            console.log('Window focused, reloading timer data');
            window.conferenceTimer.loadTimerData();
        }
    });

})(jQuery);
