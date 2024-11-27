// Doi tuong (constructor) Validator
function Validator(options) {
    var selectorRules = {};

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        // Lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];

        // Lap qua tung rule va kiem tra
        // Neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
        }

        return !errorMessage;
    }

    var formElement = $(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lap qua tung rule va validate
            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Truong hop submit voi js
                if (typeof options.onSubmit === "function") {
                    var enableInputs = formElement.querySelectorAll("[name]");

                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        return (values[input.name] = input.value) && values;
                    }, {});

                    options.onSubmit(formValues);
                }
                // Truong hop submit voi hanh vi mac dinh
                else {
                    formElement.submit();
                }
            }
        };

        // Lap qua moi rule va xu ly (lang nghe su kien)
        options.rules.forEach((rule) => {
            // Luu lai cac rule cho moi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // Xu ly blur khoi? input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };

                // Xu ly input value co su thay doi
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove("invalid");
                };
            }
        });
    }
}

// Dinh nghia cac rule
// Ngtac cac rule:
// Khi co loi => message loi
// Khi hop le => undefined
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || "Please enter this field";
        },
    };
};

Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Please check your email";
        },
    };
};

Validator.isPhone = (selector, number, message) => {
    return {
        selector: selector,
        test: function (value) {
            return value.length === 10 ? undefined : message || `Your phone number must be ${number} digits`;
        },
    };
};

Validator.isConfirm = (selector, getConfirmValue, message) => {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || "Confirm value is incorrect!";
        },
    };
};
