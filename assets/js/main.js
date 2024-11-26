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

    // Hien thi cau tra loi dau tien khi tai trang
    if (faqItems.length > 0) {
        faqItems[0].querySelector(".faq__separate").classList.toggle("active");
        faqItems[0].querySelector(".faq__answer").classList.add("open");
        faqItems[0].querySelector(".faq__icon").src = "./assets/icons/minus.svg";
    }

    if (faqItems) {
        faqItems.forEach((item) => {
            const question = item.querySelector(".faq__item-top");

            question.addEventListener("click", () => {
                // Ẩn tất cả các câu trả lời
                // faqItems.forEach((faq) => {
                //     faq.querySelector(".faq__separate").classList.toggle("active");
                //     faq.querySelector(".faq__answer").classList.toggle("open");
                //     faq.querySelector(".faq__icon").src = "./assets/icons/plus.svg"; // Icon chuyển thành dấu cộng
                // });

                // Hiển thị câu trả lời của câu hỏi hiện tại
                const answer = item.querySelector(".faq__answer");
                // const icon = item.querySelector(".faq__icon");
                const icons = item.querySelectorAll(".faq__icon");
                const separate = item.querySelector(".faq__separate");
                answer.classList.toggle("open");
                separate.classList.toggle("active");
                // icon.src = "./assets/icons/minus.svg"; // Icon chuyển thành dấu trừ
                icons.forEach((icon) => icon.classList.toggle("d-none"));
            });
        });
    }
}
window.addEventListener("template-loaded", handleFaqClick);
handleFaqClick();
