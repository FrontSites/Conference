document.addEventListener('DOMContentLoaded', () => { 
  initMenu();
  initSpeakersLoadMore();
  initScheduleVisibility();
  initHideError();
  initHeaderScroll();
  initMaskPhone();
})


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
  
  if (!scheduleSection || !scheduleWrapper) return;

  // Создаем Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Секция видна - добавляем класс active
        scheduleWrapper.classList.add('active');
      } else {
        // Секция не видна - убираем класс active
        scheduleWrapper.classList.remove('active');
      }
    });
  }, {
    // Настройки observer
    threshold: 0.3, // Секция считается видимой когда 30% её видно
    rootMargin: '0px 0px -10% 0px' // Небольшой отступ снизу
  });

  // Начинаем наблюдение за секцией
  observer.observe(scheduleSection);
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
}

function initHeaderScroll() {
  var lastScrollTop = 0;
  $(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var secondSectionTop = $('section:nth-of-type(2)').offset().top; // Определение положения второй секции
    var windowWidth = $(window).width();
  
    if (windowWidth <= 768) { // Для мобильных устройств
      if (scrollTop > secondSectionTop) {
        if (scrollTop > lastScrollTop) {
          // Прокрутка вниз
          $(".header").addClass("scrolled");
        } else if (scrollTop < lastScrollTop) {
          // Прокрутка вверх
          $(".header").removeClass("scrolled");
        }
      } else {
        $(".header").removeClass("scrolled");
      }
    } else {
      if (scrollTop > lastScrollTop) {
        // Прокрутка вниз
        $(".header").addClass("scrolled");
      } else if (scrollTop === 0) {
        // Вверху экрана
        $(".header").removeClass("scrolled");
      } else {
        // Прокрутка вверх
        $(".header").removeClass("scrolled");
      }
    }
    lastScrollTop = scrollTop;
  });
}

function initMaskPhone() {
  $('.phone').mask('+380 (99) 999-99-99');
}


function initSelect() {
  $('.select').select2();
  
}