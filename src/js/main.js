document.addEventListener('DOMContentLoaded', () => { 
  initMenu();
  initSpeakersLoadMore();
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
  const items = document.querySelectorAll('.speakers-item');
  const btn = document.querySelector('.load-more-button');
  if (!items.length || !btn) return;

  let visible = 3;
  const lang = btn.dataset.lang;
  const lessText = btn.dataset.less;

  function updateView() {
    items.forEach((item, i) => {
      item.style.display = i < visible ? '' : 'none';
    });
    if (visible >= items.length) {
      if (lang === 'en') {
        btn.querySelector('span').textContent = lessText || 'Less more';
      } else {
        btn.style.display = 'none';
      }
    } else {
      btn.querySelector('span').textContent = lang === 'en' ? 'Load more' : 'Завантажити ще';
      btn.style.display = '';
    }
  }

  updateView();

  btn.addEventListener('click', function () {
    if (visible >= items.length && lang === 'en') {
      visible = 3;
    } else {
      visible += 3;
    }
    updateView();
  });
}