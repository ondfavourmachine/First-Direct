$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll > 0) {
        $(".header-desktop").addClass("header-desktop-active");
    } else {
        $(".header-desktop").removeClass("header-desktop-active");
    }
});


(function($) {
    // 'use strict';
    // weCare Slider
    var wecareSwiper = new Swiper('.wecare-slider', {
        slidesPerView: 1,
        spaceBetween: 2,
        loop: true,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });

})(jQuery);