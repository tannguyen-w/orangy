const discounted = () => {
    const productItems = $$(".product-item");
    productItems.forEach((item) => {
        const discountTag = item.querySelector(".tag__discount");
        const priceElement = item.querySelector(".product-item__price");
        const priceOld = item.querySelector(".product-item__price--old");
        if (discountTag && priceElement) {
            priceOld.classList.add("discounted");
        }
    });
};

discounted();

var splide = new Splide(".splide", {
    perPage: 4,
    type: "loop",
    gap: 10,
    arrows: false,
    pagination: false,
});

var splide1 = new Splide(".splide", {
    perPage: 1.5,
    type: "loop",
    gap: 10,
    arrows: false,
    pagination: false,
});

const screenWidth = window.innerWidth;

if (screenWidth < 768) {
    splide1.mount();
} else {
    splide.mount();
}
