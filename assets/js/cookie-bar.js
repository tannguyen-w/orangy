// Hàm thiết lập cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Hàm lấy giá trị cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

// Kiểm tra trạng thái cookie
function checkCookieBar() {
    const accepted = getCookie("cookieAccepted");
    if (accepted) {
        // Đã chấp nhận, ẩn thanh cookie
        $(".cookie-bar").classList.add("d-none");
    }
}

// Cookie bar
document.addEventListener("DOMContentLoaded", () => {
    const acceptBtn = $(".cookie-bar__btn--accept");
    const ignoreBtn = $(".cookie-bar__btn--ignore");
    const cookieBar = $(".cookie-bar");

    checkCookieBar();

    acceptBtn.addEventListener("click", () => {
        setCookie("cookieAccepted", "true", 180);
        cookieBar.classList.add("d-none");
    });

    ignoreBtn.addEventListener("click", () => {
        cookieBar.classList.add("d-none");
    });
});
