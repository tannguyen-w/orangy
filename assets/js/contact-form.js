import Validator from "./validator.js";

loadFormData();
function loadFormData() {
    const storeData = localStorage.getItem("contactData");
    if (storeData) {
        const viewData = JSON.parse(storeData);
        document.getElementById("name").value = viewData.name || "";
        document.getElementById("email").value = viewData.email || "";
        document.getElementById("phone").value = viewData.phone || "";
        document.getElementById("address").value = viewData.address || "";
    }
}

Validator({
    form: "#form-contact",
    formGroupSelector: ".form-group",
    errorSelector: ".form-message",
    rules: [
        Validator.isRequired("#name", "Please enter your fullname"),
        Validator.isRequired("#email", "Please enter your email"),
        Validator.isRequired("#phone", "Please enter your phone number"),
        Validator.isEmail("#email"),
        Validator.isPhone("#phone", 10),
    ],
    onSubmit: function (dataForm) {
        const captchaElement = document.getElementById("captcha");
        const verifyCaptchaElement = document.getElementById("verifyCaptcha");
        const verifySuccess = document.getElementById("popup__contact-layout");
        const verifyFalse = document.getElementById("popup__newsletter-layout");
        var enableInputs = document.getElementById("form-contact").querySelectorAll("[name]");

        const postAPI = "https://testapi.demo.wgentech.com/notify.php";
        if (captchaElement) {
            captchaElement.classList.remove("d-none");
        }

        verifyCaptchaElement.addEventListener("click", async () => {
            const recaptchaResponse = grecaptcha.getResponse();

            if (!recaptchaResponse) {
                verifyFalse.classList.remove("d-none");
                return;
            }

            // Gui du lieu qua fetch
            fetch(postAPI, {
                method: "POST",
                keepalive: true,
                body: JSON.stringify(dataForm),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        for (var i = 0; i < enableInputs.length; ++i) {
                            enableInputs[i].value = "";
                        }

                        localStorage.setItem("contactData", JSON.stringify(dataForm));
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

        // Call API
        // console.log(data);
    },
});
