$(document).ready(function () {
  // if ($(window).width() >= 992) {
  //   $("li.menu-item-has-children").hover(
  //     function () {
  //       $(".menu-bg").addClass("active");
  //       $(this).find(".sub-menu").addClass("active");
  //       $(this).addClass("active");
  //     },
  //     function () {
  //       $(".menu-bg").removeClass("active");
  //       $(this).find(".sub-menu").removeClass("active");
  //       $(this).removeClass("active");
  //     }
  //   );
  // }
  // Close menu when click on link - mob-menu
  
  if ($(window).width() <= 992) {
    $("li.menu-item-has-children").click(function () {
      if (
        $(this).find(".sub-menu").hasClass("active") ||
        $(this).hasClass("active")
      ) {
        $(this).find(".sub-menu").removeClass("active");
        $(this).removeClass("active");
      } else {
        $(this).find(".sub-menu").addClass("active");
        $(this).addClass("active");
      }
    });
  }
  // Следование блока за мышкой

  // Anchor scroll - variant 2

  $(".circle").on("click", function () {
    let href = $(this).attr("href");
    let navHeight = $(".header").outerHeight();

    // Прокрутка з врахуванням висоти навбару
    $("html,body").animate(
      {
        scrollTop: $(href).offset().top - navHeight,
      },
      {
        duration: 370,
        easing: "linear",
      }
    );

    // Змінюємо URL без перезавантаження сторінки
    history.pushState(null, null, href);

    return false;
  });

  // Mob menu
  if ($(window).width() <= 992) {
    $(".btn_nav").click(function () {
      $(".burger").toggleClass("active");
      if ($(".header-wrapper").is(":hidden")) {
        $("body").addClass("hidden");

        setTimeout(function () {
          $(".header-wrapper").slideDown(200);
          $(".header-wrapper").css({ display: "flex" });
        }, 100);
      } else {
        $(".header-wrapper").slideUp(200);
        $("body").removeClass("hidden");
      }
    });

    $(".header-block  li:not(.menu-item-has-children) a").click(function () {
      $(".header-wrapper").slideUp(200);
      $(".burger").removeClass("active");
      $("body").removeClass("hidden");
    });
  }
  //  change button text and background when form sent
  var messageDuration = 3000,
    successMessage = $(".wpcf7-response-output.wpcf7-mail-sent-ok");

  successMessage.length &&
    successMessage.delay(messageDuration).fadeOut("slow");

  jQuery('input.wpcf7-submit[type="submit"]').click(function () {
    var e = jQuery(this),
      t = e.data("disableSubmit");
    return (
      (void 0 === t || !1 === t) &&
      (e.attr("value", "Mail Sent"),
      e.data("disableSubmit", !0),
      e.css("background", "gray"),
      !0)
    );
  });

  var wpcf7Elm = document.querySelectorAll(".wpcf7");
  wpcf7Elm.forEach(function (e) {
    e.addEventListener(
      "wpcf7_before_send_mail",
      function (e) {
        var t = jQuery(e.target).find('input.wpcf7-submit[type="submit"]');
        t.attr("value", "Submit");
        t.data("disableSubmit", !1).css({ background: "#ee2f2e" }); // Изменяем цвет кнопки в случае успешной отправки
      },
      !1
    );

    e.addEventListener(
      "wpcf7invalid",
      function (e) {
        var t = jQuery(e.target).find('input.wpcf7-submit[type="submit"]');
        t.attr("value", "Submit");
        t.data("disableSubmit", !1).css({ background: "#ee2f2e" }); // Изменяем цвет кнопки в случае ошибки отправки
      },
      !1
    );
  });

  // Disabled words on input phone
  $('input[type="tel"]').on("input", function () {
    $(this).val(
      $(this)
        .val()
        .replace(/[A-Za-zА-Яа-яЁё]/, "")
    );
  });
  //  input phone mask
  // $(".wpcf7-tel").mask("+1 (999) - 999 - 9999");

  // disabled numbers in name
  $(".wpcf7-text.name").on("input", function () {
    // Получаем введенный текст из элемента input
    const inputValue = $(this).val();

    // Удаляем цифры из введенного текста
    const filteredValue = inputValue.replace(/\d/g, "");

    // Обновляем значение элемента input без цифр
    $(this).val(filteredValue);
  });
  // Выберем поле с именем "number" и классом "mc"
  var mcNumberField = $("input[name='number'].mc");

  mcNumberField.on("input", function () {
    // Заменяем все символы, не являющиеся цифрами, на пустую строку
    var sanitizedValue = $(this)
      .val()
      .replace(/[^0-9]/g, "");

    // Устанавливаем очищенное значение обратно в поле
    $(this).val(sanitizedValue);
  });

  $("select").each(function () {
    $(this).select2({
      minimumResultsForSearch: Infinity,
    });
  });

  $("#sort-type").on("select2:select", function (e) {
    $("#sort-form").submit(); // Автоматически отправляем форму при выборе новой опции
  });
  $(".section-video__wrap").each(function () {
    var video = $(this).find($(".section-video__wrap video"));
    var playButton = $(this).find(".play");
    var stopButton = $(this).find(".stop");

    playButton.click(function () {
      video[0].play();
      playButton.hide();
      stopButton.show();
    });

    stopButton.click(function () {
      video[0].pause();
      video[0].currentTime = 0;
      stopButton.hide();
      playButton.show();
    });
  });

  if ($(window).width() <= 768) {
    $(".summary-toggle").click(function () {
      if ($(".summary").hasClass("active")) {
        $(".summary").removeClass("active");
      } else {
        $(".summary").addClass("active");
      }
    });

    $(".summary a").each(function () {
      $(this).click(function () {
        $(".summary").removeClass("active");
      });
    });

    // Window < 768
  }
  if ($("body").hasClass("single-format-standard")) {
    if ($(window).width() <= 768) {
      var links = $(".summary a");
      var blockRelative = $(".block-relative");
      var mainPost = $(".main-post");
      var header = $("header");
      var headerHeight = header.outerHeight();
      var isBlockFixed = false;
      var originalBlockTop = blockRelative.offset().top - headerHeight;

      function updateBlockRelative() {
        var scrollTop = $(window).scrollTop();
        var blockTop = blockRelative.offset().top - headerHeight;
        var blockBottom = blockTop + blockRelative.outerHeight();

        if (scrollTop >= blockTop && !isBlockFixed) {
          blockRelative.toggleClass("fixed", true);
          isBlockFixed = true;
        } else if (scrollTop < blockTop && isBlockFixed) {
          blockRelative.toggleClass("fixed", false);
          isBlockFixed = false;
        } else if (
          scrollTop >= blockTop &&
          scrollTop <= originalBlockTop &&
          isBlockFixed
        ) {
          blockRelative.toggleClass("fixed", false);
          isBlockFixed = false;
        }
      }

      function scrollToAnchor(href) {
        var navHeight = header.outerHeight();
        var target = $(href);

        if (target.length > 0) {
          $("html, body").animate(
            {
              scrollTop:
                target.offset().top - navHeight - blockRelative.outerHeight(),
            },
            {
              duration: 370,
              easing: "linear",
            }
          );

          setTimeout(function () {
            updateCurrentLink();
          }, 400);

          return true;
        }
        return false;
      }

      function updateCurrentLink() {
        var navHeight = header.outerHeight();
        var headerBottom = header.offset().top + navHeight;

        if ($(window).scrollTop() === 0) {
          links.removeClass("current");
          return;
        }

        links.each(function () {
          var href = $(this).attr("href");
          var target = $(href);

          if (target.length > 0) {
            if (
              target.offset().top - navHeight <= headerBottom &&
              target.offset().top >= $(window).scrollTop()
            ) {
              links.removeClass("current");
              $(this).addClass("current");
              return false;
            }
          }
        });
      }

      links.on("click", function (e) {
        e.preventDefault();
        var href = $(this).attr("href");
        scrollToAnchor(href);
      });

      function onScroll() {
        requestAnimationFrame(function () {
          updateBlockRelative();
          updateCurrentLink();
        });
      }

      function debounce(func, ms) {
        let timer;
        return function (...args) {
          clearTimeout(timer);
          timer = setTimeout(() => func.apply(this, args), ms);
        };
      }
      if ($("body").hasClass("ios")) {
        const updateBlockRelativeDebounced = debounce(updateBlockRelative, 50); // Adjust 50ms as needed
        $(window).on("scroll touchmove", updateBlockRelativeDebounced);
      } else {
        $(window).on("scroll touchmove", onScroll);
      }

      updateBlockRelative();
      updateCurrentLink();
    }
  }
  // scroll anchor desktop
  if ($(window).width() > 768) {
    var links = $(".summary a, .circle-wrap a, main-btn");
    var currentLink = null;

    function updateCurrentLink() {
      var navHeight = $("header").outerHeight();
      var headerBottom = $("header").offset().top + navHeight;

      if ($(window).scrollTop() === 0) {
        // Если страница находится в самом верху, удаляем класс "current" и выходим
        links.removeClass("current");
        currentLink = null;
        return;
      }

      links.each(function () {
        var href = $(this).attr("href");
        var target = $(href);

        if (target.length > 0) {
          // Проверяем, что верхняя часть элемента находится ниже нижней части хедера
          if (
            target.offset().top - navHeight <= headerBottom &&
            target.offset().top >= $(window).scrollTop()
          ) {
            if (currentLink !== this) {
              links.removeClass("current");
              $(this).addClass("current");
              currentLink = this;
            }
            return false; // Выходим из цикла, когда нашли соответствующий элемент
          }
        }
      });
    }

    $(window).on("scroll", function () {
      updateCurrentLink();
    });

    links.on("click", function (e) {
      e.preventDefault();

      var href = $(this).attr("href");
      var navHeight = $("header").outerHeight();

      $("html, body").animate(
        {
          scrollTop: $(href).offset().top - navHeight,
        },
        {
          duration: 500,
          easing: "linear",
        }
      );

      var anchor = href.substring(1);
      history.pushState(null, null, "#" + anchor);

      // Добавляем вызов функции с задержкой после прокрутки
      setTimeout(function () {
        updateCurrentLink();
      }, 400);

      return false;
    });
  }
  // btn to _top site
  $(".btn_top").click(function () {
    $("body, html").animate(
      {
        scrollTop: 0,
      },
      800
    );
    return false;
  });
  // add class when scroll down
  $(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    if (scrollTop > 0) {
      $(".btn_top").addClass("scrolled");
    } else {
      $(".btn_top").removeClass("scrolled");
    }
  });
  // Popup settings
  $(".popup-btn").click(function (e) {
    e.preventDefault();
    if ($(".popup-wrapper").hasClass("active")) {
      $("body").removeClass("hidden");
      $(".popup-wrapper").removeClass("active");
    } else {
      $(".popup-wrapper").addClass("active");
      $("body").addClass("hidden");
    }

    $(".close-btn").click(function () {
      $("body").removeClass("hidden");
      $(".popup-wrapper").removeClass("active");
    });
  });
  // send form on click options - filters
  if ($("div").hasClass("filters-wrap")) {
    document.addEventListener("DOMContentLoaded", function () {
      document
        .getElementById("sort-type")
        .addEventListener("change", function () {
          document.getElementById("sort-form").submit();
        });
    });

    // Добавляем следующий блок кода, который будет обновлять URL при выборе значения
    document
      .getElementById("sort-type")
      .addEventListener("change", function () {
        var selectedValue = this.value;
        var currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("sort-type", selectedValue);
        history.pushState({}, null, currentUrl);
      });
  }

  // dropdown with autoheight

  var dropdowns = $(".lessons__item-wrap");

  if ($(window).width() < 480) {
    $(".lessons__item").click(function (e) {
      e.preventDefault();

      var clickedDropdown = $(this).parent();
      var clickedDropdownContent = clickedDropdown.find(".lessons__info");

      var wasHidden = clickedDropdownContent.is(":hidden");

      dropdowns.removeClass("active");
      $(".lessons__info").slideUp(200);

      if (wasHidden) {
        clickedDropdown.addClass("active");
        clickedDropdownContent.slideDown(200, function () {
          var dropdownTop = clickedDropdown.offset().top;
          var windowHeight = $(window).height();
          var scrollTop = dropdownTop;

          $("html, body").animate(
            {
              scrollTop: scrollTop,
            },
            500
          ); // Scroll to position that aligns the top of the dropdown with the top of the viewport
        });
      }
    });
  }

  if ($("body").is("#page-blog")) {
    // Filters
    // Filters
    var page = 1;
    var category = "all";

    // Function to load posts via AJAX
    function loadPosts() {
      var security = $("#category_nonce").val();

      $.ajax({
        url: ajaxurl,
        type: "POST",
        data: {
          action: "load_posts_by_category",
          category: category,
          page: page,
          security: security,
        },
        beforeSend: function () {
          $("#load-more").hide();
          $("#spinner").show();
        },
        success: function (response) {
          $("#posts-container").html(response);
          $("#spinner").hide();
          $("#load-more").show().text("Load More");
          page++;
        },
        error: function () {
          $("#spinner").hide();
          $("#posts-container").html(
            "<p>There was an error loading the posts.</p>"
          );
        },
      });
    }

    // Initial load of posts
    function initialLoad() {
      var security = $("#category_nonce").val();

      $.ajax({
        url: ajaxurl,
        type: "POST",
        data: {
          action: "load_posts_by_category",
          category: category,
          page: 1,
          security: security,
        },
        beforeSend: function () {
          $("#posts-container").html(""); // Clear current posts
          $("#spinner").show();
        },
        success: function (response) {
          $("#posts-container").html(response);
          $("#spinner").hide();
        },
        error: function () {
          $("#spinner").hide();
          $("#posts-container").html(
            "<p>There was an error loading the posts.</p>"
          );
        },
      });
    }

    // Add the 'active' class to the 'All' category link
    $('.category-link[data-category="all"]').addClass("active");

    // Initial load of posts when the page is ready
    initialLoad();

    // Click event handler for category links
    $(".category-link").on("click", function (e) {
      e.preventDefault();
      $(".category-link").removeClass("active");
      $(this).addClass("active");
      category = $(this).data("category");
      page = 1; // Reset page number
      $("#posts-container").html(""); // Clear current posts
      initialLoad(); // Load initial posts for the selected category
    });
  }
});

//  Native javascript

//  add class if OS IOS
var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Добавляем класс к body, если это iOS-устройство
if (isiOS) {
  document.body.classList.add("ios");
}

// Swiper slider
const swiper = new Swiper(".galery", {
  slidesPerView: 2,
  spaceBetween: 30,
  centeredSlides: true,
  allowTouchMove: true,
  loop: true,
  navigation: {
    nextEl: " .swiper-button-next",
    prevEl: " .swiper-button-prev",
  },
  breakpoints: {
    320: {
      spaceBetween: 0,
      slidesPerView: 1,
    },
    768: {
      spaceBetween: 20,
      slidesPerView: 1,
    },

    992: {
      spaceBetween: 20,
      slidesPerView: 2,
    },
  },
});

var swiper2 = new Swiper(".reviews-slider", {
  effect: "coverflow",
  loop: true,
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  initialSlide: 1,
  coverflowEffect: {
    rotate: 0,
    stretch: 80,
    depth: 80,
    modifier: 3,
    slideShadows: false,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
function showReview(slideIndex) {
  var currentSlide = $(".swiper-slide-active");
  if (!currentSlide.length) return;

  var currentNumber = currentSlide.attr("data-number");

  $(".review-item").fadeOut(200);

  $('.review-item[data-number="' + currentNumber + '"]')
    .stop(true, true)
    .fadeIn(200);
}

showReview(swiper.activeIndex);

swiper.on("slideChange", function () {
  showReview(swiper.activeIndex);
});

window.addEventListener("DOMContentLoaded", () => {
  const marqueeContent = document.querySelector(".brands-items");
  const marqueeWidth = marqueeContent.offsetWidth;

  // Получение списка всех логотипов
  const logos = Array.from(marqueeContent.querySelectorAll(".brand-item"));
  const logoCount = logos.length;

  // Создание дополнительных логотипов для заполнения ширины контейнера
  let totalWidth = 0;
  let clonesNeeded = Math.ceil(marqueeWidth / (logos[0].offsetWidth + 20)); // 20 - расстояние между логотипами

  // Дублирование логотипов до заполнения ширины контейнера
  for (let i = 0; i < clonesNeeded; i++) {
    logos.forEach((logo) => {
      const clone = logo.cloneNode(true);
      marqueeContent.appendChild(clone);
      totalWidth += logo.offsetWidth + 20; // 20 - расстояние между логотипами
    });
  }

  // Анимация бегущей строки с использованием GSAP
  gsap.to(marqueeContent, {
    x: -totalWidth,
    duration: totalWidth / 50,
    repeat: -1,
    ease: "linear",
  });
});

// var messageDuration = 3000,
// successMessage = $(".wpcf7-response-output.wpcf7-mail-sent-ok");

// if (successMessage.length) {
//     successMessage.delay(messageDuration).fadeOut("slow");
// }

// jQuery('input.wpcf7-submit[type="submit"]').click(function () {
//     var e = jQuery(this),
//         t = e.data("disableSubmit");
//     if (void 0 === t || !1 === t) {
//         e.attr("value", "Надіслано");
//         e.data("disableSubmit", !0);
//         e.css("background", "#2DB85E");
//     }
//     return true;
// });

// var wpcf7Elm = document.querySelectorAll(".wpcf7");

// wpcf7Elm.forEach(function (e) {
//     e.addEventListener(
//         "wpcf7mailsent",
//         function (event) {
//             var popup = jQuery(event.target).closest('.popup');
//             var t = jQuery(event.target).find('input.wpcf7-submit[type="submit"]');
//             t.attr("value", "Надіслано");
//             t.data("disableSubmit", !1).css({ background: "#2DB85E" });
//             jQuery(event.target).find(".wpcf7-response-output").hide();
//             popup.find(".forms-items").hide();
//             popup.find(".popup-title").hide();
//             popup.find(".popup-text").hide();
//             popup.find(".thank-you-block").fadeIn(300);
//             setTimeout(function () {
//                 popup.find(".thank-you-block").css({ display: "flex" });
//             }, 50); // Добавляем класс в случае успешной отправки
//         },
//         false
//     );

//     e.addEventListener(
//         "wpcf7invalid",
//         function (event) {
//             var t = jQuery(event.target).find('input.wpcf7-submit[type="submit"]');
//             t.attr("value", "Сталася помилка");
//             t.data("disableSubmit", !1).css({ background: "#ee2f2e" });
//             setTimeout(function () {
//                 t.attr("value", "Залишити заявку");
//                 t.css({ background: "#648E66" }); // Возвращаем цвет кнопки после изменения текста
//             }, 1500); // Меняем текст через 1.5 секунды после ошибки отправки
//             jQuery(event.target)
//                 .find(".wpcf7-response-output")
//                 .removeClass("success"); // Удаляем класс в случае ошибки отправки
//         },
//         false
//     );

//     e.addEventListener(
//         "wpcf7spam",
//         function (event) {
//             var t = jQuery(event.target).find('input.wpcf7-submit[type="submit"]');
//             t.attr("value", "Підозра на спам");
//             t.data("disableSubmit", !1).css({ background: "#ee2f2e" });
//             setTimeout(function () {
//                 t.attr("value", "Спробувати безкоштовно");
//                 t.css({ background: "#EF4D2E" }); // Возвращаем цвет кнопки после изменения текста
//             }, 1500);
//             jQuery(event.target)
//                 .find(".wpcf7-response-output")
//                 .removeClass("success"); // Удаляем класс в случае спам ошибки
//         },
//         false
//     );

//     e.addEventListener(
//         "wpcf7mailfailed",
//         function (event) {
//             var t = jQuery(event.target).find('input.wpcf7-submit[type="submit"]');
//             t.attr("value", "Помилка відправки");
//             t.data("disableSubmit", !1).css({ background: "#ee2f2e" });
//             setTimeout(function () {
//                 t.attr("value", "Спробувати безкоштовно");
//                 t.css({ background: "#EF4D2E" }); // Возвращаем цвет кнопки после изменения текста
//             }, 1500);
//             jQuery(event.target)
//                 .find(".wpcf7-response-output")
//                 .removeClass("success"); // Удаляем класс в случае ошибки отправки
//         },
//         false
//     );
// });
// Функция для инициализации intlTelInput на всех полях с классом .phone
const translations = {
  en: {
    error: {
      0: "Phone number is required",
      1: "Country not found",
      2: "Incomplete number",
      3: "Too many digits",
      4: "Invalid number",
      default: "Invalid number",
    },
    valid: "Phone number entered correctly",
  },
  pl: {
    error: {
      0: "Wymagany jest numer telefonu",
      1: "Nie znaleziono kraju",
      2: "Numer wpisano niekompletnie",
      3: "Za dużo cyfr",
      4: "Błąd przy wpisywaniu numeru",
      default: "Błąd przy wpisywaniu numeru",
    },
    valid: "Numer telefonu wprowadzony poprawnie",
  },
  ua: {
    error: {
      0: "Потрібен номер телефону",
      1: "Країну не знайдено",
      2: "Неповний номер",
      3: "Забагато цифр",
      4: "Помилка при введенні номера",
      default: "Помилка при введенні номера",
    },
    valid: "Номер телефону введено правильно",
  },
  de: {
    error: {
      0: "Telefonnummer erforderlich",
      1: "Land nicht gefunden",
      2: "Unvollständige Nummer",
      3: "Zu viele Ziffern",
      4: "Ungültige Nummer",
      default: "Ungültige Nummer",
    },
    valid: "Telefonnummer korrekt eingegeben",
  },
  cz: {
    error: {
      0: "Telefonní číslo je vyžadováno",
      1: "Země nenalezena",
      2: "Neúplné číslo",
      3: "Příliš mnoho číslic",
      4: "Neplatné číslo",
      default: "Neplatné číslo",
    },
    valid: "Telefonní číslo bylo zadáno správně",
  },
};

const countryToLanguage = {
  pl: "pl", // Poland
  ua: "ua", // Ukraine
  de: "de", // Germany
  cz: "cz", // Czech Republic
  us: "en", // USA
  gb: "en", // United Kingdom
};

// const initIntlTelInputs = () => {
//     const inputs = document.querySelectorAll(".phone");

//     inputs.forEach(input => {
//       const form = input.closest('form'); // Находим ближайшую форму, содержащую текущий input
//       const errorMsg = input.parentElement.querySelector(".error-msg");
//       const validMsg = input.parentElement.querySelector(".valid-msg");
//       const submitButton = form.querySelector('[type="submit"]');
//       const acceptanceCheckbox = form.querySelector('.acceptance'); // Чекбокс принятия условий
//       const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]'); // Все обязательные поля

//       const errorMap = {
//         0: "Phone number is required",
//         1: "Country not found",
//         2: "Number entered incompletely",
//         3: "Too many digits",
//         4: "Error entering number"
//       };

//       const iti = window.intlTelInput(input, {
//         initialCountry: "us", // выбираем США по умолчанию
//         utilsScript: "./intlTelInputWithUtils.min.js",
//         nationalMode: false
//       });

//       // Скрываем .valid-msg изначально
//       validMsg.classList.add("hide");

//       const reset = () => {
//         input.classList.remove("error");
//         errorMsg.innerHTML = "";
//         errorMsg.classList.add("hide");
//         validMsg.classList.add("hide");
//       };

//       const showError = (msg) => {
//         input.classList.add("error");
//         errorMsg.innerHTML = msg;
//         errorMsg.classList.remove("hide");
//         validMsg.classList.add("hide");
//       };

//       const validatePhone = () => {
//         reset();
//         if (!input.value.trim()) {
//           showError("Error entering number");
//           return false; // Номер не введен, форма не валидна
//         } else if (iti.isValidNumber()) {
//           validMsg.classList.remove("hide");
//           return true; // Номер введен правильно, форма валидна
//         } else {
//           const errorCode = iti.getValidationError();
//           let msg;
//           if (document.body.classList.contains('en')) {
//             msg = errorMapEnglish[errorCode] || "Error entering number";
//           } else {
//             msg = errorMap[errorCode] || "Error entering number";
//           }
//           showError(msg);
//           return false; // Номер не валиден, форма не валидна
//         }
//       };

//       const restrictInput = (event) => {
//         const key = event.key;

//         // Разрешаем редактирование клавишами, которые не добавляют символы
//         const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];

//         if (iti.isValidNumber() && !allowedKeys.includes(key)) {
//           const inputLength = input.value.length;
//           const selectionStart = input.selectionStart;
//           const selectionEnd = input.selectionEnd;

//           // Если длина введенного номера равна длине значения и курсор не выделяет текст, запрещаем ввод
//           if (inputLength === selectionEnd && selectionStart === selectionEnd) {
//             event.preventDefault();
//           }
//         }
//       };

//       const checkFormValidity = () => {
//         const isPhoneValid = validatePhone();
//         const isAcceptanceChecked = acceptanceCheckbox.checked;
//         const areAllFieldsFilled = Array.from(requiredFields).every(field => field.value.trim() !== "");

//         if (isPhoneValid && isAcceptanceChecked && areAllFieldsFilled) {
//           submitButton.classList.remove("disabled");
//           submitButton.disabled = false;
//         } else {
//           submitButton.classList.add("disabled");
//           submitButton.disabled = true;
//         }
//       };

//       // Проверяем валидность номера при изменении
//       input.addEventListener('input', checkFormValidity);

//       // Ограничиваем ввод после валидного номера
//       input.addEventListener('keypress', restrictInput);
//       input.addEventListener('keydown', restrictInput);
//       input.addEventListener('paste', restrictInput);

//       // Проверяем чекбокс на изменение состояния
//       acceptanceCheckbox.addEventListener('change', checkFormValidity);

//       // Проверяем другие обязательные поля при их изменении
//       requiredFields.forEach(field => {
//         field.addEventListener('input', checkFormValidity);
//       });

//       // Вызываем проверку при загрузке страницы, чтобы сразу проверить валидность
//       checkFormValidity();
//     });
//   };

//   // Вызываем функцию для инициализации наших полей
//   initIntlTelInputs();

// под интернациональный телефон
document.addEventListener("DOMContentLoaded", function () {
  // Находим все формы на странице
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    // Инициализация intlTelInput для каждого поля с телефоном в форме
    const phoneInput = form.querySelector(".phone");
    const iti = window.intlTelInput(phoneInput, {
      initialCountry: "us",
      utilsScript: "./intlTelInputWithUtils.min.js",
      nationalMode: false,
    });

    // Функция для получения сообщения об ошибке в зависимости от страны и языка
    const getErrorMessage = (errorCode, countryCode) => {
      const language = countryToLanguage[countryCode] || "en"; // Язык на основе страны или дефолтный английский
      const currentTranslations = translations[language]; // Получаем переводы для текущего языка
      return (
        currentTranslations.error[errorCode] ||
        currentTranslations.error.default
      );
    };

    // Инициализация JustValidate для текущей формы
    const validation = new JustValidate(form, {
      errorFieldCssClass: "is-invalid",
      errorLabelCssClass: "is-label-invalid",
    });

    // Добавляем валидацию для других полей в форме
    validation
      .addField(form.querySelector(".name"), [
        {
          rule: "required",
          errorMessage: "Name is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Name must be at least 3 characters",
        },
      ])
      .addField(form.querySelector(".email"), [
        {
          rule: "required",
          errorMessage: "Email is required",
        },
        {
          rule: "email",
          errorMessage: "Email is invalid",
        },
      ])
      // Валидация поля с телефоном
      .addField(phoneInput, [
        {
          rule: "required",
          errorMessage: "Phone number is required", // сообщение по умолчанию
        },
        {
          validator: () => {
            const countryCode = iti.getSelectedCountryData().iso2; // Получаем код страны
            if (!iti.isValidNumber()) {
              const errorCode = iti.getValidationError();
              validation.showErrors({
                [phoneInput]: getErrorMessage(errorCode, countryCode),
              });
              return false; // Номер не валиден
            }
            return true; // Номер валиден
          },
          errorMessage: "Invalid phone number",
        },
      ])
      .onSuccess((event) => {
        event.target.submit(); // Отправка формы после успешной валидации
      });
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   var phoneFields = document.querySelectorAll('.iti__tel-input');
//   var hiddenPhoneNumberFields = document.querySelectorAll('input[name="phone-number"]');

//   // Убедитесь, что количество полей совпадает
//   if (phoneFields.length === hiddenPhoneNumberFields.length) {
//       phoneFields.forEach(function(phoneField, index) {
//           var hiddenPhoneNumberField = hiddenPhoneNumberFields[index];

//           function updateHiddenField() {
//               var dialCodeElement = phoneField.closest('.iti').querySelector('.iti__selected-dial-code');
//               var dialCodeValue = dialCodeElement ? dialCodeElement.textContent.trim() : '';
//               hiddenPhoneNumberField.value = dialCodeValue + ' ' + phoneField.value;
//           }

//           // Обновление скрытого поля при вводе, изменении, фокусе и потере фокуса
//           phoneField.addEventListener('input', updateHiddenField);
//           phoneField.addEventListener('change', updateHiddenField);
//           phoneField.addEventListener('focus', updateHiddenField);
//           phoneField.addEventListener('blur', function() {
//               if (phoneField.value === '') {
//                   hiddenPhoneNumberField.value = '';
//               } else {
//                   updateHiddenField();
//               }
//           });

//           // Обновление скрытого поля при загрузке страницы
//           updateHiddenField();
//       });
//   } else {
//       console.warn('Mismatch between phone fields and hidden phone number fields.');
//   }
// });

// Just validation
// just validationconst validator = new JustValidate('#basic_form');

/////////////////////////////////////////////////////////////////////////////////////
// под маску инпут

// const validate = new JustValidate('#basic_form');

// validate.addField('#basic_name', [
//   {
//     rule: 'required',
//   },
//   {
//     rule: 'minLength',
//     value: 3,
//   },
//   {
//     rule: 'maxLength',
//     value: 15,
//   },

// ])
// .addField('#basic_email', [
//   {
//     rule: 'required',
//   },
//   {
//     rule: 'required',
//   },
//   {
//     rule: 'email',
//   },
// ])

// .addField('#basic_phone', [
//     {
//         rule: 'required',
//         errorMessage: 'Телефон обязателен',
//     },
//     {
//         validator: (value) => {
//             // Убираем символы маски и проверяем, что введено 9 цифр (вместе с кодом страны 12 цифр)
//             const unmaskedValue = value.replace(/\D/g, ''); // Убираем все нечисловые символы
//             return unmaskedValue.length === 12; // Проверяем длину введённого номера
//         },
//         errorMessage: 'Введите корректный телефон',
//     },

// ])
// .onSuccess((event) => {
//     // Сабмит формы срабатывает при успешной валидации
//     event.target.submit();
// });
document.addEventListener("DOMContentLoaded", function () {
  // Для всех полей с именем 'email'
  const emailFields = document.querySelectorAll("input[name='email']");

  emailFields.forEach(function (emailField) {
    if (emailField) {
      emailField.addEventListener("input", function () {
        const emailValue = emailField.value;
        const [localPart, domainPart] = emailValue.split("@");

        // Ограничиваем только локальную часть до 64 символов
        if (localPart && localPart.length > 64) {
          emailField.value =
            localPart.slice(0, 64) + (domainPart ? "@" + domainPart : "");
        }
      });
    }
  });

  // Для всех полей с именем 'name'
  const nameFields = document.querySelectorAll("input[name='name']");

  nameFields.forEach(function (nameField) {
    $(nameField).on("input", function () {
      // Получаем значение поля
      let inputValue = $(this).val();

      // Разрешаем только латинские буквы и пробелы
      inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");

      // Находим, если есть более одной заглавной буквы без пробела
      const match = inputValue.match(/([A-Z][a-z]*)([A-Z])/);

      if (match) {
        // Автоматически добавляем пробел перед второй заглавной буквой
        inputValue = inputValue.replace(/([A-Z][a-z]*)([A-Z])/, "$1 $2");
      }

      // Разделяем значение на слова по пробелам
      let words = inputValue.split(" ");

      // Обрабатываем каждое слово для правильного форматирования
      words = words.map((word) => {
        // Преобразуем первую букву в заглавную, остальные в строчные
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });

      // Объединяем слова обратно в строку
      let filteredValue = words.join(" ");

      // Обновляем значение поля с отфильтрованным текстом
      $(this).val(filteredValue);
    });
  });
});


$(".wpcf7-text.name").on("input", function () {
  // Get the input value
  let inputValue = $(this).val();

  // Filter the input value to allow only Latin letters and spaces
  inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");

  // Find if there's more than one uppercase letter without a space
  const match = inputValue.match(/([A-Z][a-z]*)([A-Z])/);

  if (match) {
      // Automatically insert a space before the second uppercase letter
      inputValue = inputValue.replace(/([A-Z][a-z]*)([A-Z])/, '$1 $2');
  }

  // Split input value into words by space
  let words = inputValue.split(' ');

  // Process each word to ensure proper capitalization
  words = words.map((word, index) => {
      // Capitalize the first letter and make the rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the words back together with a space
  let filteredValue = words.join(' ');

  // Update the input value with the filtered text
  $(this).val(filteredValue);
});

const emailField = document.querySelector('.wpcf7 .email');

if (emailField) {
  emailField.addEventListener('input', function () {
      const emailValue = emailField.value;
      const [localPart, domainPart] = emailValue.split('@');

      if (localPart && localPart.length > 64) {
          emailField.value = localPart.slice(0, 64) + (domainPart ? '@' + domainPart : '');
      }
  });
}
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