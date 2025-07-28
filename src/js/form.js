$(document).ready(function () {
  // Для каждой формы на странице инициализируем JustValidate и обрабатываем отправку
  $("form").each(function () {
    const form = $(this);
    const formBlock = form.closest(".form-block"); // Находим обертку формы
    const validate = new JustValidate(form[0], {
      errorFieldCssClass: "error", // Класс для полей с ошибками
      errorLabelCssClass: "error-message", // Класс для сообщений об ошибках
    });

    // Добавляем валидацию для полей формы
    const nameField = form.find("[name='name']").get(0);
    const emailField = form.find("[name='email']").get(0);
    const commentField = form.find("[name='comment']").get(0);
    const positionField = form.find("[name='position']").get(0);
    const companyField = form.find("[name='company']").get(0);

    // Проверяем существование полей перед добавлением валидации
    if (nameField) {
      validate.addField(nameField, [
        {
          rule: "required",
          errorMessage: "Name is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Name must be at least 3 characters",
        },
        {
          rule: "maxLength",
          value: 15,
          errorMessage: "Name must be no more than 15 characters",
        },
      ]);
    }

    if (emailField) {
      validate.addField(emailField, [
        {
          rule: "required",
          errorMessage: "Email is required",
        },
        {
          rule: "email",
          errorMessage: "Please enter a valid email address",
        },
      ]);
    }

    if (commentField) {
      validate.addField(commentField, [
        {
          rule: "maxLength",
          value: 250,
          errorMessage: "Comment must be no more than 250 characters",
        },
      ]);
    }

    // Кастомная валидация поля select (position)
    if (positionField) {
      validate.addField(positionField, [
        {
          rule: "required",
          errorMessage: "Please choose your work position",
          validator: () => {
            if (positionField.value === "") {
              // Если значение пустое (плейсхолдер), добавляем класс ошибки вручную
              $(positionField).addClass("error");
              $(".error-message").show();
              return false;
            } else {
              // Если значение выбрано, убираем класс ошибки
              $(positionField).removeClass("error");
              $(".error-message").hide();
              return true;
            }
          },
        },
      ]);
    }

    // Добавляем валидацию поля company, если оно существует
    if (companyField) {
      validate.addField(companyField, [
        {
          rule: "required",
          errorMessage: "Company is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Company must be at least 3 characters",
        },
      ]);
    }

    // Обрабатываем успешную валидацию для каждой формы
    validate.onSuccess(function (event) {
      event.preventDefault(); // предотвращаем стандартную отправку формы

      // Получаем токен reCAPTCHA и отправляем форму
      grecaptcha.ready(function() {
        grecaptcha.execute(recaptchaParams.siteKey, {action: 'submit'}).then(function(token) {
          // Добавляем токен в данные формы
          sendFormData(form, token);
        });
      });

      // Скрываем обертку .form-block после успешной валидации
      formBlock.fadeOut(200);

      // Сброс формы и показ блока через 10 секунд
      setTimeout(function () {
        form[0].reset(); // Сбрасываем форму
        formBlock.fadeIn(200);
      }, 10000); // 10 секунд

      $(".success").addClass("valid"); // Показываем сообщение об успехе
      setTimeout(function () {
        $(".success").removeClass("valid");
      }, 9800);
    });
  });

  function sendFormData(form, recaptchaToken) {
    // Собираем данные формы
    var formData = {
      action: "handle_contact_form",
      "name-form": form.find("[name='name-form']").val(),
      name: form.find("[name='name']").val(),
      email: form.find("[name='email']").val(),
      comment: form.find("[name='comment']").val() || "",
      g_recaptcha_response: recaptchaToken, // Добавляем токен reCAPTCHA
    };

    // Добавляем поле company только если оно существует
    if (form.find("[name='company']").length) {
      formData.company = form.find("[name='company']").val();
    }

    // Добавляем поле position только если оно существует
    if (form.find("[name='position']").length) {
      formData.position = form.find("[name='position']").val();
    }

    // Отправка AJAX-запроса
    $.ajax({
      type: "POST",
      url: recaptchaParams.ajaxurl, // Используем ajaxurl, переданный через wp_localize_script
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          // Успешная отправка
          $(".success").addClass("valid");
          // Дополнительные действия при успехе (если нужны)
        } else {
          // Ошибка на сервере
          $(".error-message").fadeIn().text(response.data.message || "Error").delay(5000).fadeOut();
          $(".success").removeClass("valid");
          $(".invalid").addClass("show");

          setTimeout(function () {
            $(".invalid").removeClass("show");
          }, 9800);
          form.closest(".form-block").hide();
        }
      },
      error: function () {
        // Ошибка отправки запроса
        $(".error-message").fadeIn().text("Error").delay(5000).fadeOut();
        $(".success").removeClass("valid");
        $(".invalid").addClass("show");

        setTimeout(function () {
          $(".invalid").removeClass("show");
        }, 9800);
        form.closest(".form-block").hide();
      },
    });
  }
});
