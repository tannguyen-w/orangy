const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

// Header
function handleArrowClick() {
    const arrows = $$(".header__content-top--arrow");

    arrows.forEach((arrow) => {
        arrow.onclick = () => {
            console.log(arrow);

            const infoPhone = $(".header__phone");
            const infoAddress = $(".header__address");
            if (infoPhone.classList.contains("d-md-none")) {
                infoPhone.classList.remove("d-md-none");
                infoAddress.classList.add("d-md-none");
            } else {
                infoPhone.classList.add("d-md-none");
                infoAddress.classList.remove("d-md-none");
            }
        };
    });
}

window.addEventListener("template-loaded", handleArrowClick);
handleArrowClick();

// Cate product
function handleCateClick() {
    const categories = $$(".products-cate__item");
    const productCate = $$(".products-list");

    categories.forEach((cate, index1) => {
        cate.onclick = () => {
            let cateOld = $(".products-cate__item--active");
            cateOld.classList.remove("products-cate__item--active");
            cate.classList.add("products-cate__item--active");

            productCate.forEach((item, index2) => {
                if (index1 === index2) {
                    let productCateOld = $(".products-list--active");
                    productCateOld.classList.remove("products-list--active");
                    item.classList.add("products-list--active");
                }
            });
        };
    });
}
window.addEventListener("template-loaded", handleCateClick);
handleCateClick();

// FAQs click - Show popup

function handleFaqClick() {
    const faqQuestions = $$(".faq__item-top");
    const faqPopupOverlay = $("#faq-popup-overlay");
    const faqPopup = $("#faq-popup");
    const faqPopupClose = $("#faq-popup-close");
    const faqPopupTitle = $("#faq-popup-title");
    const faqPopupBody = $("#faq-popup-body");

    // Check if elements exist before adding listeners
    if (!faqQuestions || !faqPopupOverlay || !faqPopup || !faqPopupClose) {
        return;
    }

    // Add click listeners to FAQ questions
    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            const questionText = faqItem.querySelector(".faq__question").textContent;
            const answerText = faqItem.querySelector(".faq__answer").textContent;

            // Update popup content
            faqPopupTitle.textContent = questionText;
            faqPopupBody.textContent = answerText;

            // Show popup
            faqPopupOverlay.classList.remove("d-none");
            setTimeout(() => {
                faqPopup.classList.add("show");
            }, 10);
        });
    });

    // Close popup when clicking overlay
    faqPopupOverlay.addEventListener("click", (e) => {
        if (e.target === faqPopupOverlay) {
            closeFaqPopup();
        }
    });

    // Close popup when clicking close button
    faqPopupClose.addEventListener("click", () => {
        closeFaqPopup();
    });

    function closeFaqPopup() {
        faqPopup.classList.remove("show");
        setTimeout(() => {
            faqPopupOverlay.classList.add("d-none");
        }, 300);
    }
}
document.addEventListener("DOMContentLoaded", handleFaqClick);
window.addEventListener("template-loaded", handleFaqClick);

// Popup
document.addEventListener("DOMContentLoaded", () => {
    const popupLayout = $("#popup__layout");

    let popupTimer;

    const showPopup = () => {
        const lastClosedTime = localStorage.getItem("popupClosedTime");
        if (lastClosedTime) {
            const elapsedTime = Date.now() - parseInt(lastClosedTime, 10);
            // Nếu chưa đủ 4 giờ (4 * 60 * 60 * 1000 ms), không hiển thị
            if (elapsedTime < 4 * 60 * 60 * 1000) return;
        }
        popupLayout.classList.remove("d-none");
    };

    const hidePopup = () => {
        popupLayout.classList.add("d-none");
        localStorage.setItem("popupClosedTime", Date.now());
    };

    popupLayout.addEventListener("click", (e) => {
        if (e.target.classList.value === "layout" || e.target.classList.value === "popup__btn-img") {
            hidePopup();
        }
    });

    const handleUserInteraction = () => {
        clearTimeout(popupTimer);
        popupTimer = setTimeout(showPopup, 3000);

        document.removeEventListener("mousemove", handleUserInteraction);
        document.removeEventListener("touchmove", handleUserInteraction);
    };

    document.addEventListener("mousemove", handleUserInteraction);
    document.addEventListener("touchmove", handleUserInteraction);
});

// Popup contact and letter
document.addEventListener("DOMContentLoaded", () => {
    const popupContactLayout = $("#popup__contact-layout");
    const popupNewsletterLayout = $("#popup__newsletter-layout");

    popupContactLayout.addEventListener("click", (e) => {
        if (e.target.classList.value === "layout" || e.target.classList.value === "popup__btn-img") {
            popupContactLayout.classList.add("d-none");
        }
    });

    popupNewsletterLayout.addEventListener("click", (e) => {
        if (e.target.classList.value === "layout" || e.target.classList.value === "popup__btn-img") {
            popupNewsletterLayout.classList.add("d-none");
        }
    });
});
