// Надежная инициализация с повторными попытками
function initializeAll() {
  try {
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
    
    
  } catch (error) {
    setTimeout(initializeAll, 1000);
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initializeAll);

// Дополнительная инициализация при полной загрузке страницы
window.addEventListener('load', () => {
  // Проверяем, что все элементы загрузились
  const mapElement = document.getElementById("map");
  const scheduleSection = document.querySelector('.schedule');
  
  if (mapElement && !mapElement.innerHTML.trim()) {
 
    initGoogleMaps();
  }
  
  if (scheduleSection && !document.querySelector('.shedule-wrapper.active')) {
   
    initScheduleVisibility();
  }
});

// Инициализация при изменении размера окна (для адаптивности)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initMenu();
    initSpeakersLoadMore();
    initScheduleVisibility();
  }, 300);
});

// Google Maps инициализация
function initGoogleMaps() {
  const mapElement = document.getElementById("map");
  console.log('initGoogleMaps called, mapElement:', mapElement);
  console.log('window.mapConfig:', window.mapConfig);
  
  if (!mapElement) {
    console.log('Map element not found');
    return;
  }
  
  if (!window.mapConfig || !window.mapConfig.apiKey) {
    console.log('Map config or API key not found');
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
  const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
  existingScripts.forEach(script => script.remove());

  // Удаляем все элементы Google Maps из DOM
  const googleElements = document.querySelectorAll('[id*="gmp-"], [class*="gmp-"]');
  googleElements.forEach(element => element.remove());

  // Очищаем глобальные переменные Google Maps
  if (window.google) {
    delete window.google;
  }

  // Устанавливаем флаг загрузки
  window.googleMapsLoading = true;

  const script = document.createElement("script");
  const language = window.mapConfig.language || 'uk';
  const timestamp = Date.now(); // Добавляем уникальный параметр
  script.src = `https://maps.googleapis.com/maps/api/js?key=${window.mapConfig.apiKey}&language=${language}&loading=async&callback=initLocationMap&v=weekly`;
  script.async = true;
  script.defer = true;
  
  script.onerror = function () {
    window.googleMapsLoading = false;
    const mapElement = document.getElementById("map");
    if (mapElement) {
      mapElement.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Карта временно недоступна</div>';
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
      mapElement.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Карта временно недоступна</div>';
    }
    return;
  }

  const customStyle = [
    { featureType: "all", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#cccccc" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f0f0f0" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#999999" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
    { featureType: "poi", elementType: "labels.icon", stylers: [{ color: "#666666" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e8e8e8" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#d0d0d0" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ color: "#666666" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#f0f0f0" }] },
    { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] }
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
    gestureHandling: "cooperative"
  });

  const isEnglish = window.mapConfig.language === 'en';
  
  // Создаем обычный маркер (стабильный API)
  const marker = new google.maps.Marker({
    position: { lat: 50.44921066476974, lng: 30.5407736837048 },
    map: map,
    title: isEnglish ? "Parkovy Congress and Exhibition Center" : "Парковий Конгресно-виставковий центр",
    icon: {
      url: `${window.location.origin}/wp-content/themes/conference/assets/images/pin.svg`,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 40)
    }
  });

  const infowindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 5px 0; color: #333;">${isEnglish ? 'Parkovy Congress and Exhibition Center' : 'Парковий Конгресно-виставковий центр'}</h3>
        <p style="margin: 0; color: #666; font-size: 14px;">${isEnglish ? 'Naberezhne Shose, 2' : 'Набережне шосе, 2'}</p>
      </div>
    `
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
      $(".header-wrapper li:not(.menu-item-has-children) a").off("click.mobileMenu");
  
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
  
        $(".header-wrapper li:not(.menu-item-has-children) a").on("click.mobileMenu", function () {
          $(".header-wrapper").slideUp(200);
          $(".burger").removeClass("active");
          $("body").removeClass("hidden");
        });
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
  const items = document.querySelectorAll('.speakers-item');
  const btn = document.querySelector('.load-more-button');
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
      $(extraItems).slideUp(300, function() {
        // После анимации убеждаемся что элементы скрыты
        $(this).hide();
      });
    }
  }

  // Обновляем текст кнопки и классы
  function updateButtonText() {
    const span = btn.querySelector('span');
    if (isExpanded) {
      span.textContent = hideText;
      btn.classList.add('active');
    } else {
      span.textContent = lang === 'en' ? 'Load more' : 'Завантажити ще';
      btn.classList.remove('active');
    }
  }

  // Инициализация
  hideExtraItems();
  updateButtonText();

  // Обработчик клика
  btn.addEventListener('click', function () {
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
  const scheduleSection = document.querySelector('.schedule');
  const scheduleWrapper = document.querySelector('.shedule-wrapper');
  
  if (!scheduleSection || !scheduleWrapper) {
    console.log('⚠️ Элементы расписания не найдены');
    return;
  }

  // Очищаем предыдущий observer если есть
  if (window.scheduleObserver) {
    window.scheduleObserver.disconnect();
  }

  // Создаем Intersection Observer с улучшенными настройками
  window.scheduleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Секция видна - добавляем класс active
        scheduleWrapper.classList.add('active');
        console.log('📅 Расписание активировано');
      } else {
        // Секция не видна - убираем класс active
        scheduleWrapper.classList.remove('active');
      }
    });
  }, {
    // Улучшенные настройки observer
    threshold: [0, 0.1, 0.3, 0.5], // Множественные пороги для лучшей точности
    rootMargin: '0px 0px -5% 0px' // Уменьшенный отступ для более быстрой реакции
  });

  // Начинаем наблюдение за секцией
  window.scheduleObserver.observe(scheduleSection);
  
  // Дополнительная проверка через 2 секунды
  setTimeout(() => {
    if (!scheduleWrapper.classList.contains('active')) {
      console.log('🔄 Принудительная активация расписания...');
      scheduleWrapper.classList.add('active');
    }
  }, 2000);
}

function initHideError() {
  // add Class Error when form not validade
document.addEventListener('wpcf7invalid', function (event) {
  const $form = $(event.target);
  
  setTimeout(function () {
    const $response = $form.find('.wpcf7-response-output');
  
    $response
      .addClass('error')
      .stop(true, true)
      .css('opacity', 1)
      .show();
  
    setTimeout(function () {
      $response.fadeOut(400, function () {
        $(this).removeClass('error').css('display', 'none');
      });
    }, 3000);
  }, 100); 
  }, false);

  // Показываем popup-success при успешной отправке
  document.addEventListener('wpcf7mailsent', function (event) {
    const $form = $(event.target);
    const $popup = $form.closest('.popup-wrapper');
    const $formItems = $popup.find('.form-items');
    const $popupTitle = $popup.find('h2');
    const $popupSuccess = $popup.find('.popup-success');
    
    // Скрываем форму, заголовок и показываем сообщение об успехе
    $formItems.fadeOut(300);
    $popupTitle.fadeOut(300, function() {
      $popupSuccess.css('display', 'flex').fadeIn(300);
    });
  }, false);

  // Обработчик для кнопки в popup-success
  $(document).on('click', '.popup-success .main-button', function() {
    const $popup = $(this).closest('.popup-wrapper');
    $popup.fadeOut(300);
  });
}

function initHeaderScroll() {
  var lastScrollTop = 0;
  var ticking = false;
  
  function updateHeader() {
    var scrollTop = $(window).scrollTop();
    var secondSectionTop = $('section:nth-of-type(2)').offset().top;
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
  $('.phone').mask('+380 (99) 999-99-99');
}

function initSelect() {
  $('.select').select2({
    minimumResultsForSearch: Infinity
  }).on('select2:select', function() {
    // Когда выбираем опцию - делаем текст полностью белым
    $(this).next('.select2-container').find('.select2-selection__rendered').css('opacity', '1');
  }).on('select2:unselect', function() {
    // Когда убираем выбор - возвращаем прозрачность
    $(this).next('.select2-container').find('.select2-selection__rendered').css('opacity', '0.8');
  }).on('select2:opening', function() {
    // При открытии списка тоже делаем текст белым
    $(this).next('.select2-container').find('.select2-selection__rendered').css('opacity', '1');
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