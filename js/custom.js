(function ($) {
  "use strict";

  // PRE LOADER
  $(window).on('load', function () {
    $('.preloader').fadeOut(1000); // set duration in brackets    
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
    const target = $($anchor.attr('href'));

    if (target.length) {
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 49
      }, 1000);
    }

    event.preventDefault();
  });

})(jQuery);
