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

// FAQs click

function handleFaqClick() {
    const faqItems = $$(".faq__item");
    const questions = $$(".faq__item-top");

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            questions.forEach((q) => {
                if (q !== question) {
                    const faqItem = q.parentElement;
                    const answerElement = faqItem.querySelector(".faq__answer");
                    const separateElement = faqItem.querySelector(".faq__separate");
                    const iconElement = faqItem.querySelector(".faq__icon");

                    if (answerElement.classList.contains("open")) {
                        answerElement.classList.remove("open");
                        separateElement.classList.remove("active");
                        iconElement.src = "./assets/icons/plus.svg";
                    }
                }
            });

            const faqItemElement = question.parentElement;
            const answer = faqItemElement.querySelector(".faq__answer");
            const separate = faqItemElement.querySelector(".faq__separate");
            const icon = faqItemElement.querySelector(".faq__icon");

            answer.classList.toggle("open");
            separate.classList.toggle("active");
            icon.src = answer?.classList.contains("open") ? "./assets/icons/minus.svg" : "./assets/icons/plus.svg";
        });
    });
}
document.addEventListener("DOMContentLoaded", handleFaqClick);

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
        console.log(popupTimer);

        document.removeEventListener("mousemove", handleUserInteraction);
        document.removeEventListener("touchmove", handleUserInteraction);
    };

    document.addEventListener("mousemove", handleUserInteraction);
    document.addEventListener("touchmove", handleUserInteraction);
});
