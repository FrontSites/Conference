// Простая проверка загрузки JavaScript


// Проверка загрузки стилей
function checkStylesLoaded() {
  const styleSheets = Array.from(document.styleSheets);
  const mainStyle = styleSheets.find(
    (sheet) => sheet.href && sheet.href.includes("main.min.css")
  );

  if (!mainStyle) {
    // Показываем fallback стили
    document.body.style.background = "#000";
    document.body.style.color = "#fff";
    document.body.innerHTML =
      '<div class="error">Стили не загрузились. Обновите страницу.</div>';
    return false;
  }

  return true;
}

// Надежная инициализация с повторными попытками
function initializeAll() {
  try {
    // Проверяем загрузку стилей
    if (!checkStylesLoaded()) {
      return;
    }

    // Инициализация Google Maps (если есть карта)
    initGoogleMaps();

    // Инициализация остальных компонентов
    initMenu();
    initSpeakersLoadMore();
    initScheduleVisibility();
    initHideError();
    initHeaderScroll();
    initMaskPhone();
    initSelect();
    initPopup();
    initTimer();
    initMarque();
    initSupport();
  } catch (error) {
    // Повторная попытка через 1 секунду
    setTimeout(initializeAll, 1000);
  }
}

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  initializeAll();
});

// Дополнительная инициализация при полной загрузке страницы
window.addEventListener("load", () => {
  // Проверяем, что все элементы загрузились
  const mapElement = document.getElementById("map");
  const scheduleSection = document.querySelector(".schedule");

  if (mapElement && !mapElement.innerHTML.trim()) {
    initGoogleMaps();
  }

  if (scheduleSection && !document.querySelector(".shedule-wrapper.active")) {
    initScheduleVisibility();
  }
});

// Инициализация при изменении размера окна (для адаптивности)
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initMenu();
    initSpeakersLoadMore();
    initScheduleVisibility();
    initMarque();
    initSupport();
  }, 300);
});

// Google Maps инициализация
function initGoogleMaps() {
  const mapElement = document.getElementById("map");

  if (!mapElement) {
    return;
  }

  if (!window.mapConfig || !window.mapConfig.apiKey) {
    return;
  }

  // Глобальная переменная для отслеживания загрузки
  if (window.googleMapsLoading) {
    return;
  }

  // Проверяем, не загружен ли уже Google Maps API
  if (window.google && window.google.maps) {
    initLocationMap();
    return;
  }

  // Удаляем все существующие скрипты Google Maps
  const existingScripts = document.querySelectorAll(
    'script[src*="maps.googleapis.com"]'
  );
  existingScripts.forEach((script) => script.remove());

  // Удаляем все элементы Google Maps из DOM
  const googleElements = document.querySelectorAll(
    '[id*="gmp-"], [class*="gmp-"]'
  );
  googleElements.forEach((element) => element.remove());

  // Очищаем глобальные переменные Google Maps
  if (window.google) {
    delete window.google;
  }

  // Устанавливаем флаг загрузки
  window.googleMapsLoading = true;

  const script = document.createElement("script");
  const language = window.mapConfig.language || "uk";
  const timestamp = Date.now(); // Добавляем уникальный параметр
  script.src = `https://maps.googleapis.com/maps/api/js?key=${window.mapConfig.apiKey}&language=${language}&loading=async&callback=initLocationMap&v=weekly`;
  script.async = true;
  script.defer = true;

  script.onerror = function () {
    window.googleMapsLoading = false;
    const mapElement = document.getElementById("map");
    if (mapElement) {
      mapElement.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #666;">Карта временно недоступна</div>';
    }
  };

  document.head.appendChild(script);
}

// Инициализация карты (вызывается Google Maps API)
function initLocationMap() {
  // Сбрасываем флаг загрузки
  window.googleMapsLoading = false;

  const mapElement = document.getElementById("map");
  if (!mapElement || typeof google === "undefined" || !google.maps) {
    if (mapElement) {
      mapElement.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #666;">Карта временно недоступна</div>';
    }
    return;
  }

  const customStyle = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#cccccc" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f0f0f0" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#999999" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#e0e0e0" }],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ color: "#666666" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e8e8e8" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#d0d0d0" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#e0e0e0" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ color: "#666666" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#f0f0f0" }],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
  ];

  const map = new google.maps.Map(mapElement, {
    zoom: 16,
    center: { lat: 50.44921066476974, lng: 30.5407736837048 },
    styles: customStyle,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "cooperative",
  });

  const isEnglish = window.mapConfig.language === "en";

  // Создаем обычный маркер (стабильный API)
  const marker = new google.maps.Marker({
    position: { lat: 50.44921066476974, lng: 30.5407736837048 },
    map: map,
    title: isEnglish
      ? "Parkovy Congress and Exhibition Center"
      : "Парковий Конгресно-виставковий центр",
    icon: {
      url: `${window.location.origin}/wp-content/themes/conference/assets/images/pin.svg`,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 40),
    },
  });

  const infowindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 3px 10px; max-width: 250px; font-family: 'Manrope', sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 3px;">
          <img src="${
            window.location.origin
          }/wp-content/themes/conference/assets/images/pin.svg" 
               style="width: 24px; height: 24px; margin-right: 8px;" alt="Pin">
          <span style="font-weight: 700; font-size: 15px; color: #333; text-transform: uppercase;">FULLSET</span>
        </div>
        <div style="text-align: left;">
          <h3 style="margin: 0 0 2px 0; color: #666; font-size: 14px; font-weight: 400; text-align: left;">${
            isEnglish
              ? "Parkovy Congress and Exhibition Center"
              : "Парковий Конгресно-виставковий центр"
          }</h3>
          <p style="margin: 0; color: #333; font-size: 13px; font-weight: 700; text-align: left;">${
            isEnglish ? "Naberezhne Shose, 2" : "Набережне шосе, 2"
          }</p>
        </div>
      </div>
    `,
  });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

function initMenu() {
  function initMobileMenu() {
    function setupMobileMenuHandlers() {
      // Remove previous handlers
      $(".btn_nav").off("click.mobileMenu");
      $(".header-wrapper li:not(.menu-item-has-children) a").off(
        "click.mobileMenu"
      );

      if ($(window).width() <= 1160) {
        $(".btn_nav").on("click.mobileMenu", function () {
          $(".burger").toggleClass("active");
          if ($(".header-wrapper").is(":hidden")) {
            $("body").addClass("hidden");
            setTimeout(function () {
              $(".header-wrapper").slideDown(200);
              $(".header-wrapper").css({ display: "flex" });
            }, 100);
          } else {
            $(".header-wrapper").slideUp(200);
            setTimeout(function () {}, 300);
            $("body").removeClass("hidden");
          }
        });

        $(".header-wrapper li:not(.menu-item-has-children) a").on(
          "click.mobileMenu",
          function () {
            $(".header-wrapper").slideUp(200);
            $(".burger").removeClass("active");
            $("body").removeClass("hidden");
          }
        );
      } else {
        // Reset states if switching to desktop
        $(".burger").removeClass("active");
        $(".header-wrapper").removeAttr("style");
        $("body").removeClass("hidden");
      }
    }

    // Init on load
    setupMobileMenuHandlers();

    // Re-init on resize
    $(window).on("resize.mobileMenu", function () {
      setupMobileMenuHandlers();
    });
  }

  // Вызываем функцию инициализации мобильного меню
  initMobileMenu();
}

function initSpeakersLoadMore() {
  if ($(window).width() <= 600) {
    const items = document.querySelectorAll(".speakers-item");
    const btn = document.querySelector(".load-more-button");
    if (!items.length || !btn) return;

    const lang = btn.dataset.lang;
    const hideText = btn.dataset.hide;
    let isExpanded = false;

    // Скрываем все элементы кроме первых 3
    function hideExtraItems() {
      items.forEach((item, i) => {
        if (i >= 3) {
          $(item).hide();
        }
      });
    }

    // Показываем все элементы с анимацией
    function showAllItems() {
      const hiddenItems = Array.from(items).slice(3);
      if (hiddenItems.length > 0) {
        $(hiddenItems).slideDown(300);
      }
    }

    // Скрываем лишние элементы с анимацией
    function hideExtraItemsAnimated() {
      const extraItems = Array.from(items).slice(3);
      if (extraItems.length > 0) {
        $(extraItems).slideUp(300, function () {
          // После анимации убеждаемся что элементы скрыты
          $(this).hide();
        });
      }
    }

    // Обновляем текст кнопки и классы
    function updateButtonText() {
      const span = btn.querySelector("span");
      if (isExpanded) {
        span.textContent = hideText;
        btn.classList.add("active");
      } else {
        span.textContent = lang === "en" ? "Load more" : "Завантажити ще";
        btn.classList.remove("active");
      }
    }

    // Инициализация
    hideExtraItems();
    updateButtonText();

    // Обработчик клика
    btn.addEventListener("click", function () {
      if (isExpanded) {
        // Скрываем лишние элементы
        hideExtraItemsAnimated();
        isExpanded = false;
      } else {
        // Показываем все элементы
        showAllItems();
        isExpanded = true;
      }
      updateButtonText();
    });
  }
}

function initScheduleVisibility() {
  const scheduleSection = document.querySelector(".schedule");
  const scheduleWrapper = document.querySelector(".shedule-wrapper");

  if (!scheduleSection || !scheduleWrapper) {
    return;
  }

  // Очищаем предыдущий observer если есть
  if (window.scheduleObserver) {
    window.scheduleObserver.disconnect();
  }

  // Создаем Intersection Observer с улучшенными настройками
  window.scheduleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Секция видна - добавляем класс active
          scheduleWrapper.classList.add("active");
        } else {
          // Секция не видна - убираем класс active
          scheduleWrapper.classList.remove("active");
        }
      });
    },
    {
      // Улучшенные настройки observer
      threshold: [0, 0.1, 0.3, 0.5], // Множественные пороги для лучшей точности
      rootMargin: "0px 0px -5% 0px", // Уменьшенный отступ для более быстрой реакции
    }
  );

  // Начинаем наблюдение за секцией
  window.scheduleObserver.observe(scheduleSection);

  // Дополнительная проверка через 2 секунды
  setTimeout(() => {
    if (!scheduleWrapper.classList.contains("active")) {
      scheduleWrapper.classList.add("active");
    }
  }, 2000);
}

function initHideError() {
  // add Class Error when form not validade
  document.addEventListener(
    "wpcf7invalid",
    function (event) {
      const $form = $(event.target);

      setTimeout(function () {
        const $response = $form.find(".wpcf7-response-output");

        $response.addClass("error").stop(true, true).css("opacity", 1).show();

        setTimeout(function () {
          $response.fadeOut(400, function () {
            $(this).removeClass("error").css("display", "none");
          });
        }, 3000);
      }, 100);
    },
    false
  );

  // Показываем popup-success при успешной отправке
  document.addEventListener(
    "wpcf7mailsent",
    function (event) {
      const $form = $(event.target);
      const $popup = $form.closest(".popup-wrapper");
      const $formItems = $popup.find(".form-items");
      const $popupTitle = $popup.find("h2");
      const $popupSuccess = $popup.find(".popup-success");

      // Скрываем форму, заголовок и показываем сообщение об успехе
      $formItems.fadeOut(300);
      $popupTitle.fadeOut(300, function () {
        $popupSuccess.css("display", "flex").fadeIn(300);
      });
    },
    false
  );

  // Обработчик для кнопки в popup-success
  $(document).on("click", ".popup-success .main-button", function () {
    const $popup = $(this).closest(".popup-wrapper");
    $popup.fadeOut(300);
  });
}

function initHeaderScroll() {
  var lastScrollTop = 0;
  var ticking = false;

  function updateHeader() {
    var scrollTop = $(window).scrollTop();
    var secondSectionTop = $("section:nth-of-type(2)").offset().top;
    var windowWidth = $(window).width();

    if (windowWidth <= 768) {
      if (scrollTop > secondSectionTop) {
        if (scrollTop > lastScrollTop) {
          $(".header").addClass("scrolled");
        } else if (scrollTop < lastScrollTop) {
          $(".header").removeClass("scrolled");
        }
      } else {
        $(".header").removeClass("scrolled");
      }
    } else {
      if (scrollTop > lastScrollTop) {
        $(".header").addClass("scrolled");
      } else if (scrollTop === 0) {
        $(".header").removeClass("scrolled");
      } else {
        $(".header").removeClass("scrolled");
      }
    }
    lastScrollTop = scrollTop;
    ticking = false;
  }

  $(window).scroll(function () {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

function initMaskPhone() {
  $(".phone").mask("+380 (99) 999-99-99");
}

function initSelect() {
  $(".select")
    .select2({
      minimumResultsForSearch: Infinity,
    })
    .on("select2:select", function () {
      // Когда выбираем опцию - делаем текст полностью белым
      $(this)
        .next(".select2-container")
        .find(".select2-selection__rendered")
        .css("opacity", "1");
    })
    .on("select2:unselect", function () {
      // Когда убираем выбор - возвращаем прозрачность
      $(this)
        .next(".select2-container")
        .find(".select2-selection__rendered")
        .css("opacity", "0.8");
    })
    .on("select2:opening", function () {
      // При открытии списка тоже делаем текст белым
      $(this)
        .next(".select2-container")
        .find(".select2-selection__rendered")
        .css("opacity", "1");
    });
}

function initPopup() {
  $(".popup-btn").each(function () {
    $(this).click(function (e) {
      e.preventDefault();
      $("body").addClass("hidden");
      // Показываем попап
      $(".popup-wrapper").fadeIn(200);
      setTimeout(function () {
        $(".popup").addClass("show");
      }, 300);
      setTimeout(function () {
        $(".popup-wrapper").css({ display: "flex" });
      }, 50);
    });
  });
  $(".close-button").click(function () {
    $(".popup").removeClass("show");
    $("body").removeClass("hidden");
    $(".popup-wrapper").fadeOut();
  });
}

// Инициализация таймера конференции
function initTimer() {
  
  if (typeof timer_ajax !== "undefined") {
    
  }

  class ConferenceTimer {
    constructor() {
     

      this.timerElement = $("#conference-timer");
      this.daysElement = $("#timer-days");
      this.hoursElement = $("#timer-hours");
      this.minutesElement = $("#timer-minutes");
      this.secondsElement = $("#timer-seconds");
      this.daysLabelElement = $("#timer-days-label");
      this.hoursLabelElement = $("#timer-hours-label");
      this.minutesLabelElement = $("#timer-minutes-label");
      this.secondsLabelElement = $("#timer-seconds-label");
      this.pricesElement = $("#timer-prices");
      this.interval = null;
      this.endTime = 0;
      this.isPaused = false;
      this.isEnabled = false;
      this.isHidden = false;
      this.serverTimeOffset = 0;
      this.labels = window.timerLabels || {
        days: ["день", "дня", "днів"],
        hours: ["година", "години", "годин"],
        minutes: ["хвилина", "хвилини", "хвилин"],
        seconds: ["секунда", "секунди", "секунд"],
      };

     

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

      // Проверяем, есть ли timer_ajax
      if (typeof timer_ajax === "undefined") {
        console.error("timer_ajax is not defined");
        return;
      }

      $.ajax({
        url: timer_ajax.ajaxurl,
        type: "POST",
        data: {
          action: "get_timer_data",
          nonce: timer_ajax.nonce,
        },
        success: (response) => {
         

          if (response.success && response.data) {
            const data = response.data;
            this.isEnabled = data.enabled;
            this.isPaused = data.paused;
            this.isHidden = data.hidden;
            this.endTime = data.endTimestamp * 1000; // Конвертируем в миллисекунды
            this.labels = data.labels || this.labels;

            // Отладочная информация для данных таймера
           

            // Обновляем заголовок таймера
            if (data.texts && data.texts.title) {
              $(".timer-title").text(data.texts.title);
            }

            

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
          } else {
          }
        },
        error: (xhr, status, error) => {
        
        },
      });
    }

    updatePrices(data) {

      // Создаем HTML для цен
      let pricesHtml = "";

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
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      // Отладочная информация
      

      // Проверяем, что элементы существуют перед обновлением
      if (this.daysElement.length > 0) {
        this.daysElement.text(days.toString().padStart(2, "0"));
        console.log("Days updated to:", days.toString().padStart(2, "0"));
      } else {
        console.error("Days element not found!");
      }

      if (this.hoursElement.length > 0) {
        this.hoursElement.text(hours.toString().padStart(2, "0"));
      } else {
      }

      if (this.minutesElement.length > 0) {
        this.minutesElement.text(minutes.toString().padStart(2, "0"));
      } else {
      }

      if (this.secondsElement.length > 0) {
        this.secondsElement.text(seconds.toString().padStart(2, "0"));
      } else {
      }

      // Обновляем подписи с правильными окончаниями
      this.daysLabelElement.text(this.getTimeLabel(days, this.labels.days));
      this.hoursLabelElement.text(this.getTimeLabel(hours, this.labels.hours));
      this.minutesLabelElement.text(
        this.getTimeLabel(minutes, this.labels.minutes)
      );
      this.secondsLabelElement.text(
        this.getTimeLabel(seconds, this.labels.seconds)
      );
    }

    getTimeLabel(number, labels) {
      // Для английского языка
      if (
        labels[0] === "day" ||
        labels[0] === "hour" ||
        labels[0] === "minute" ||
        labels[0] === "second"
      ) {
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

  // Создаем экземпляр таймера
  window.conferenceTimer = new ConferenceTimer();

  // Обработка видимости страницы для точности таймера
  document.addEventListener("visibilitychange", function () {
    if (window.conferenceTimer && !document.hidden) {
      window.conferenceTimer.loadTimerData();
    }
  });

  // Обработка фокуса окна для синхронизации времени
  window.addEventListener("focus", function () {
    if (window.conferenceTimer) {
      window.conferenceTimer.loadTimerData();
    }
  });
}

function initMarque() {
  
  const marqueeContent = document.querySelector('.marque-items');
  if (!marqueeContent) {
    return;
  }

  // Сразу определяем правильную скорость для текущего устройства
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 480;
  const initialDuration = isMobile ? '60s' : '30s';
  
  // Сохраняем оригинальный контент
  const originalContent = marqueeContent.innerHTML;
  
  // Создаем две копии для бесконечной анимации
  marqueeContent.innerHTML = originalContent + originalContent;
  
  // Функция для обновления скорости анимации
  const updateMarqueeSpeed = () => {
    const currentScreenWidth = window.innerWidth;
    let animationDuration;
    
    if (currentScreenWidth <= 480) {
      animationDuration = '60s'; // Медленнее для мобильных
    } else {
      animationDuration = '30s'; // Обычная скорость для десктопа
    }
    
    // Обновляем CSS переменную
    document.documentElement.style.setProperty('--marquee-duration', animationDuration);
  };
  
  // Добавляем CSS анимацию через стили с правильной начальной скоростью
  const style = document.createElement('style');
  style.textContent = `
    .marque-items {
      animation: marquee-scroll var(--marquee-duration, ${initialDuration}) linear infinite;
    }
    
    @keyframes marquee-scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    .marque-items:hover {
      animation-play-state: paused;
    }
  `;
  
  // Добавляем стили в head, если их еще нет
  if (!document.querySelector('#marquee-styles')) {
    style.id = 'marquee-styles';
    document.head.appendChild(style);
  }
  
  // Устанавливаем правильную скорость сразу
  document.documentElement.style.setProperty('--marquee-duration', initialDuration);
  
  // Обновляем скорость при изменении размера окна
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateMarqueeSpeed();
    }, 250);
  });
  
}

function initSupport() { 
  console.log('Support initialization started');
  
  const supportIcon = document.querySelector('.support-icon');
  const supportBlock = document.querySelector('.support-block');
  const supportItems = document.querySelectorAll('.support-items a');
  
  console.log('Support icon found:', supportIcon);
  console.log('Support block found:', supportBlock);
  console.log('Support items found:', supportItems.length);
  
  if (!supportIcon || !supportBlock) {
    console.log('Support elements not found');
    return;
  }
  
  // Клик по иконке поддержки
  supportIcon.addEventListener('click', function(e) {
    console.log('Support icon clicked');
    e.preventDefault();
    e.stopPropagation();
    supportBlock.classList.toggle('active');
    console.log('Support block active class toggled');
  });
  
  // Клик по ссылкам в меню поддержки
  supportItems.forEach(function(item) {
    item.addEventListener('click', function() {
      console.log('Support item clicked');
      supportBlock.classList.remove('active');
    });
  });
  
  // Закрываем при клике вне области поддержки
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.support-icon') && !e.target.closest('.support-block')) {
      supportBlock.classList.remove('active');
    }
  });
}