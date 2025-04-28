(function ($) {
  "use strict";

  // PRE LOADER
  $(window).on('load', function () {
    $('.preloader').fadeOut(1000); // set duration in brackets    

    // === ВИДЕО/ИЗОБРАЖЕНИЕ ЗА ДЕСКТОП И МОБИЛЕН ===
    const isMobile = window.innerWidth <= 768;
    const homeSection = document.querySelector("#home");

    if (!isMobile && homeSection) {
      const video = document.createElement("video");
      video.src = "images/mvngr.mp4";
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("aria-hidden", "true");
      video.style.position = "absolute";
      video.style.top = "0";
      video.style.left = "0";
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      video.style.zIndex = "-1";

      video.addEventListener("canplaythrough", function () {
        homeSection.style.background = "none";
      });

      homeSection.prepend(video);
    }
  });

  // MENU
  $('.navbar-collapse a').on('click', function () {
    $(".navbar-collapse").collapse('hide');
  });

  $(window).on('scroll', function () {
    if ($(".navbar").offset().top > 50) {
      $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
      $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
  });

  // PARALLAX EFFECT
  if ($.stellar) {
    $.stellar({
      horizontalScrolling: false,
    });
  }

  // ABOUT SLIDER
  if ($('.owl-carousel').length) {
    $('.owl-carousel').owlCarousel({
      animateOut: 'fadeOut',
      items: 1,
      loop: true,
      autoplayHoverPause: false,
      autoplay: true,
      smartSpeed: 1000,
    });
  }

  // SMOOTHSCROLL с проверка за съществуващ anchor
$('.custom-navbar a').on('click', function (event) {
  const $anchor = $(this);
  const href = $anchor.attr('href');

  // Само ако href започва с # => smooth scroll
  if (href.startsWith("#")) {
    const target = $(href);
    if (target.length) {
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 49
      }, 1000);
    }
    event.preventDefault();
  }
});
})(jQuery);

// Version: v1.0.2 | Last updated: 2025-04-28
