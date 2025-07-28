// ===================== MAIN ENTRY =====================
document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initHeaderScroll();
  initHeroCards();
  initSelect2();
  initInputMasks();
  initNameInput();
  initEmailInput();
  initDateAndUrlFields();
  initDotNumberValidation();
  initUcrSlider();
  initCf7Buttons();
  initFormStepNavigation();
  initStrongLiChecker();
  initNameFormField();
  initSvgButtons();
  initWpcf7FormInvalid();
});

// ===================== FUNCTIONS =====================

function initWpcf7FormInvalid() {
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

function initMobileMenu() {
  $(window).on('resize', setupMobileMenuHandlers);
  setupMobileMenuHandlers();
  function setupMobileMenuHandlers() {
    $('.btn_nav').off('click.mobileMenu');
    $('.header-wrapper li:not(.menu-item-has-children) a').off('click.mobileMenu');
    if ($(window).width() <= 992) {
      $('.btn_nav').on('click.mobileMenu', function () {
        $('.burger').toggleClass('active');
        $('.header-wrapper').toggleClass('active');
        if ($('.header-wrapper').hasClass('active')) {
          $('body').addClass('hidden');
          $('.container').addClass('active');
        } else {
          $('body').removeClass('hidden');
          $('.container').removeClass('active');
        }
      });
      $('.header-wrapper li:not(.menu-item-has-children) a').on('click.mobileMenu', function () {
        $('.header-wrapper').removeClass('active');
        $('.burger').removeClass('active');
        $('body').removeClass('hidden');
        $('.container').removeClass('active');
      });
    }
  }
}

function initHeaderScroll() {
  var lastScrollTop = 0;
  $(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var secondSectionTop = $('section:nth-of-type(2)').offset() ? $('section:nth-of-type(2)').offset().top : 0;
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
  });
}

function initHeroCards() {
  $(window).on('resize', setupHeroCardsHandlers);
  setupHeroCardsHandlers();
  function setupHeroCardsHandlers() {
    let heroCards = document.querySelectorAll('.hero-card');
    heroCards.forEach((card) => {
      card.replaceWith(card.cloneNode(true));
    });
    heroCards = document.querySelectorAll('.hero-card');
    const windowWidth = $(window).width();
    if (windowWidth > 1024) {
      if (heroCards.length > 0) {
        heroCards[0].classList.add('opened');
        heroCards.forEach((card, idx) => {
          if (idx === 0) return;
          card.addEventListener('mouseenter', function () {
            heroCards[0].classList.remove('opened');
          });
          card.addEventListener('mouseleave', function () {
            heroCards[0].classList.add('opened');
          });
        });
        heroCards[0].addEventListener('mouseenter', function () {
          heroCards[0].classList.add('opened');
        });
      }
    } else if (windowWidth >= 730 && windowWidth <= 1024) {
      if (heroCards.length > 0) {
        heroCards[0].classList.add('opened');
        $('.hero-card').off('click.heroCard').on('click.heroCard', function(e) {
          if (!$(this).hasClass('opened')) {
            $('.hero-card').removeClass('opened').removeData('ready');
            $(this).addClass('opened').data('ready', true);
            e.preventDefault();
          } else if ($(this).data('ready')) {
            $(this).removeData('ready');
          }
        });
      }
    }
  }
}

function initSelect2() {
  $("select").each(function () {
    $(this).select2({
      minimumResultsForSearch: Infinity,
      placeholder: "Select service",
    });
  });
}

function initInputMasks() {
  $(".wpcf7-tel").mask("+1 (999) - 999 - 9999");
}

function initNameInput() {
  $(".wpcf7-text.name").on("input", function () {
    let inputValue = $(this).val();
    inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");
    const match = inputValue.match(/([A-Z][a-z]*)([A-Z])/);
    if (match) {
      inputValue = inputValue.replace(/([A-Z][a-z]*)([A-Z])/, '$1 $2');
    }
    let words = inputValue.split(' ');
    words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    let filteredValue = words.join(' ');
    $(this).val(filteredValue);
  });
}

function initEmailInput() {
  const emailFields = document.querySelectorAll("input[name='email']");
  emailFields.forEach(function (emailField) {
    if (emailField) {
      emailField.addEventListener("input", function () {
        const emailValue = emailField.value;
        const [localPart, domainPart] = emailValue.split("@");
        if (localPart && localPart.length > 64) {
          emailField.value = localPart.slice(0, 64) + (domainPart ? "@" + domainPart : "");
        }
      });
    }
  });
}

function initDateAndUrlFields() {
  document.querySelectorAll('.wpcf7 form').forEach(function(form) {
    var dateField = form.querySelector('input[name="date"]');
    if (dateField) {
      dateField.value = new Date().toISOString().slice(0, 10);
      form.querySelectorAll('input, textarea').forEach(function(inputField) {
        inputField.addEventListener('input', function() {
          dateField.value = new Date().toISOString().slice(0, 10);
        });
      });
    }
  });
  var urlField = document.querySelector('input[name="page-url"]');
  if (urlField) {
    urlField.value = window.location.href;
  }
}

function initDotNumberValidation() {
  document.addEventListener('input', function (e) {
    if (e.target.matches('input[name="dot-number"]')) {
      const maxLength = 8;
      e.target.value = e.target.value.slice(0, maxLength);
      const errorTip = e.target.nextElementSibling;
      if (errorTip && errorTip.classList.contains('wpcf7-not-valid-tip')) {
        errorTip.remove();
      }
      if (e.target.value.length === 1 && e.target.value.startsWith('0')) {
        e.target.value = '';
      }
    }
  });
  document.addEventListener('blur', function (e) {
    if (e.target.matches('input[name="dot-number"]')) {
      const minLength = 3;
      if (e.target.value.length < minLength) {
        const existingTip = e.target.nextElementSibling;
        if (existingTip && existingTip.classList.contains('wpcf7-not-valid-tip')) {
          existingTip.remove();
        }
        const errorTip = document.createElement('span');
        errorTip.className = 'wpcf7-not-valid-tip';
        errorTip.textContent = `The DOT Number must be at least ${minLength} digits and cannot start with 0.`;
        e.target.parentNode.insertBefore(errorTip, e.target.nextSibling);
      }
    }
  }, true);
}

function initUcrSlider() {
  if ($("body").hasClass("page-template-ucr") || $("body").hasClass("page-template-ucr-test")) {
    const ranges = [
      '0-2', '3-5', '6-20', '21-100', '101-1000', '10001 and above'
    ];
    const prices = {
      "0-2": "$99", "3-5": "$199", "6-20": "$349", "21-100": "$1,099", "101-1000": "$4,799", "10001 and above": "$45,999"
    };
    const links = {
      "0-2": "https://buy.stripe.com/14k3cKaNLf5i0I89AA",
      "3-5": "https://buy.stripe.com/3cs7t04pn6yMgH68wx",
      "6-20": "https://buy.stripe.com/5kA00y8FD3mA3Uk4gk",
      "21-100": "https://buy.stripe.com/aEUaFc5tr8GU4YofZ0",
      "101-1000": "https://buy.stripe.com/7sI28GbRP5uI3Uk4gj",
      "10001 and above": "https://buy.stripe.com/3cseVs5tr0aoaiIcMR"
    };
    document.querySelectorAll('.form-wrapper-ucr').forEach((formWrapper) => {
      const formItems = formWrapper.querySelectorAll('.form-item');
      formItems.forEach((formItem) => {
        const slider = formItem.querySelector('.range-slider');
        const valueDisplay = formItem.querySelector('.range-value');
        const localPriceDisplay = formItem.querySelector('.form-price-block .price');
        const form = formWrapper.querySelector('.wpcf7-form');
        const globalPriceDisplay = formWrapper.querySelector('.form-block .form-items .form-item .form-price-block .price');
        const hiddenInput = form?.querySelector('input[name="vehicle-quantity"]');
        if (slider) {
          noUiSlider.create(slider, {
            start: [0], connect: [true, false], range: { min: 0, max: ranges.length - 1 }, step: 1
          });
          slider.noUiSlider.on('update', function (values) {
            const selectedIndex = Math.round(values[0]);
            const selectedRange = ranges[selectedIndex];
            if (valueDisplay) valueDisplay.textContent = `${selectedRange} vehicles`;
            if (localPriceDisplay) localPriceDisplay.textContent = prices[selectedRange];
            if (globalPriceDisplay) globalPriceDisplay.textContent = prices[selectedRange];
            if (form) form.action = links[selectedRange];
            if (hiddenInput) hiddenInput.value = selectedRange;
          });
        }
      });
    });
  }
}

function initCf7Buttons() {
  if ($("body").hasClass("page-template-ucr")) {
    $(document).ready(function () {
      $('.cf7mls_next').on('click', function () {
        let currentWrapper = $(this).closest('.form-wrapper-ucr');
        let currentStep = currentWrapper.find('.step-form.active');
        let nextStep = currentStep.next('.step-form');
        if (nextStep.length) {
          nextStep.addClass('active');
          currentWrapper.find('.form-title').text('Your details');
          currentWrapper.find('.form-text').hide();
        }
      });
      $('.cf7mls_back').on('click', function () {
        let currentWrapper = $(this).closest('.form-wrapper-ucr');
        let currentStep = currentWrapper.find('.step-form.active');
        let prevStep = currentStep.prev('.step-form');
        if (prevStep.length) {
          currentStep.removeClass('active');
          prevStep.addClass('active');
          currentWrapper.find('.form-title').text('How many vehicles you need?');
          currentWrapper.find('.form-text').show().text('Finish steps to get the Best Rates for 2024 UCR Registration');
        }
      });
      if($(window).width() >=768) {
        $('.wpcf7-form').each(function () {
          let errorShown = false;
          $(this).on('wpcf7invalid', function () {
            const $form = $(this);
            const $responseOutput = $form.find('.wpcf7-response-output');
            const $submitButton = $form.find('input[type="submit"]');
            if ($submitButton.length) {
              const originalText = $submitButton.data('original-text') || $submitButton.text();
              $submitButton.data('original-text', originalText);
              $submitButton.text("Error");
              setTimeout(() => { $submitButton.text(originalText); }, 3000);
            }
            if (!errorShown && $responseOutput.length) {
              errorShown = true;
              $responseOutput.stop(true, true).fadeIn();
              setTimeout(() => { $responseOutput.stop(true, true).fadeOut(); }, 2000);
            }
          });
          $(this).on('submit', function () {
            errorShown = false;
            const $responseOutput = $(this).find('.wpcf7-response-output');
            if ($responseOutput.length) {
              $responseOutput.stop(true, true).hide();
            }
          });
        });
      }
    });
  }
}

function initFormStepNavigation() {
  // SVG для кнопок Next и Back
  const nextSVG = `<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5289 7.97084L10.4045 14.0952C10.2796 14.2201 10.1101 14.2903 9.93343 14.2903C9.75673 14.2903 9.58727 14.2201 9.46232 14.0952C9.33738 13.9702 9.26719 13.8008 9.26719 13.6241C9.26719 13.4474 9.33738 13.2779 9.46232 13.153L14.4497 8.16556L0.98309 8.16619C0.894637 8.16777 0.806757 8.15172 0.724576 8.11897C0.642394 8.08622 0.567557 8.03744 0.504432 7.97546C0.441307 7.91348 0.391157 7.83955 0.35691 7.75798C0.322662 7.67641 0.305003 7.58884 0.304961 7.50037C0.304919 7.41191 0.322497 7.32432 0.356668 7.24272C0.390838 7.16112 0.440918 7.08714 0.503984 7.0251C0.567051 6.96306 0.641842 6.9142 0.723992 6.88138C0.806143 6.84855 0.894009 6.83242 0.982462 6.83391L14.4497 6.83391L9.46233 1.8465C9.33738 1.72155 9.26719 1.55209 9.26719 1.37539C9.26719 1.19869 9.33738 1.02923 9.46233 0.904288C9.58727 0.779344 9.75673 0.709151 9.93343 0.709151C10.1101 0.709151 10.2796 0.779344 10.4045 0.904288L16.5289 7.02863C16.6538 7.15358 16.724 7.32304 16.724 7.49974C16.724 7.67644 16.6538 7.8459 16.5289 7.97084Z" fill="black"/></svg>`;
  const backSVG = `<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.471123 7.97084L6.59547 14.0952C6.72041 14.2201 6.88987 14.2903 7.06657 14.2903C7.24327 14.2903 7.41273 14.2201 7.53768 14.0952C7.66262 13.9702 7.73281 13.8008 7.73281 13.6241C7.73281 13.4474 7.66262 13.2779 7.53768 13.153L2.55026 8.16556L16.0169 8.16619C16.1054 8.16777 16.1932 8.15172 16.2754 8.11897C16.3576 8.08622 16.4324 8.03744 16.4956 7.97546C16.5587 7.91348 16.6088 7.83955 16.6431 7.75798C16.6773 7.67641 16.695 7.58884 16.695 7.50037C16.6951 7.41191 16.6775 7.32432 16.6433 7.24272C16.6092 7.16112 16.5591 7.08714 16.496 7.0251C16.4329 6.96306 16.3582 6.9142 16.276 6.88138C16.1939 6.84855 16.106 6.83242 16.0175 6.83391L2.55026 6.83391L7.53767 1.8465C7.66262 1.72155 7.73281 1.55209 7.73281 1.37539C7.73281 1.19869 7.66262 1.02923 7.53767 0.904288C7.41273 0.779344 7.24327 0.709151 7.06657 0.709151C6.88987 0.709151 6.72041 0.779344 6.59547 0.904288L0.471122 7.02863C0.346178 7.15358 0.275985 7.32304 0.275985 7.49974C0.275985 7.67644 0.346178 7.8459 0.471123 7.97084Z" fill="black"/></svg>`;
  document.querySelectorAll('.cf7mls_next').forEach(button => { button.innerHTML += nextSVG; });
  document.querySelectorAll('.cf7mls_back').forEach(button => { button.innerHTML = backSVG + button.innerHTML; });
}

function initStrongLiChecker() {
  $('.hero-item.right .block-text ul').each(function() {
    var hasStrongInEvenLi = false;
    $(this).find('li:even').each(function() {
      if ($(this).find('strong').length > 0) {
        hasStrongInEvenLi = true;
        return false;
      }
    });
    if (hasStrongInEvenLi) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
}

function initNameFormField() {
  if (!document.body.classList.contains('page-template-front-page')) {
    var currentPath = window.location.pathname;
    var pathSegments = currentPath.split('/').filter(Boolean);
    var lastSegment = pathSegments.pop();
    var formattedSegment = lastSegment ? lastSegment.replace(/-/g, ' ') : '';
    var hiddenInput = document.querySelector('input[name="name-form"]');
    if (hiddenInput) {
      hiddenInput.value = formattedSegment;
    }
  }
}

function initSvgButtons() {
  // Пустышка для совместимости, если потребуется добавить SVG-кнопки в будущем
}