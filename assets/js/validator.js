// Doi tuong (constructor) Validator
export default function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            } else {
                element = element.parentElement;
            }
        }
    }

    var selectorRules = {};

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        // var errorElement = getParent(inputElement, ".form-group")
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];

        // Lap qua tung rule va kiem tra
        // Neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case "checkbox":
                case "radio":
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ":checked"));
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add("invalid");
        } else {
            errorElement.innerText = "";
            getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
        }

        return !errorMessage;
    }

    var formElement = document.querySelector(options.form);
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
                        switch (input.type) {
                            case "radio":
                                if (input.matches(":checked")) {
                                    values[input.name] = formElement.querySelector(
                                        'input[name="' + input.name + '"]:checked'
                                    ).value;
                                } else {
                                    values[input.name] = "";
                                }
                                break;
                            case "checkbox":
                                if (!input.matches(":checked")) {
                                    values[input.name] = "";
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case "file":
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
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

            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach((inputElement) => {
                // Xu ly blur khoi? input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };

                // Xu ly input value co su thay doi
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(
                        options.errorSelector
                    );
                    errorElement.innerText = "";
                    getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
                };
            });
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
            return value ? undefined : message || "Please enter this field";
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
