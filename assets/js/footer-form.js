import Validator from "./validator.js";

Validator({
    form: "#footer-form",
    formGroupSelector: ".form-group",
    errorSelector: ".form-message",
    rules: [Validator.isRequired("#email", "Please enter your email"), Validator.isEmail("#email")],
    onSubmit: function (footerForm) {
        const captchaElement = document.getElementById("captcha");
        const verifyCaptchaElement = document.getElementById("verifyCaptcha");
        const verifySuccess = document.getElementById("popup__contact-layout");
        const verifyFalse = document.getElementById("popup__newsletter-layout");
        const inputElement = document.querySelector(".footer__input");

        const postAPI =
            "https://script.google.com/macros/s/AKfycbwlnruolAEFek8x1wUYLxocHdIuwHWrHYXSfzSXZSygslzejM-ppDe76EuK8jkKWyB4/exec";

        if (captchaElement) {
            captchaElement.classList.remove("d-none");
        }

        verifyCaptchaElement.addEventListener("click", async () => {
            const recaptchaResponse = grecaptcha.getResponse();
            const formData = new FormData();
            formData.append("email", footerForm["email"]);

            if (!recaptchaResponse) {
                verifyFalse.classList.remove("d-none");
                return;
            }

            // Gui du lieu qua fetch
            fetch(postAPI, {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);

                    if (data.result) {
                        verifySuccess.classList.remove("d-none");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            // Reset captcha và ẩn container
            grecaptcha.reset();
            captchaElement.classList.add("d-none");
        });
    },
});
