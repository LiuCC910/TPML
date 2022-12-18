// 自行加入的JS請寫在這裡
$(function() {
    //sticky sidebar
    if ($('.stickySidebar').length > 0) {
        var stickySidebar = new StickySidebar('.stickySidebar', {
            containerSelector: '.main',
            topSpacing: 93,
            bottomSpacing: 0,
            minWidth: 768,
            resizeSensor: true,
        });
    }
    // 首頁輪播
    $('.mpSlider').slick({
        mobileFirst: true,
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        fade: true,
        lazyLoaded: true,
        lazyLoad: 'ondemand',
        ease: 'ease',
        pauseOnHover: false,
        pauseOnFocus: false,
        customPaging: function(slider, i) {
            var title = $(slider.$slides[i]).find('img').attr('alt').trim();
            return $('<button type="button" aria-label="' + title + '"/>').text(title);
        }
    });
    // 廣告輪播
    $('.adSlider').slick({
        mobileFirst: true,
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        arrow: true,
        lazyLoaded: true,
        lazyLoad: 'ondemand',
        ease: 'ease',
        responsive: [{
            breakpoint: 1200,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
                arrows: true
            }
        }, {
            breakpoint: 768,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true
            }
        }, {
            breakpoint: 575,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true
            }
        }]
    });
    //燈箱slick+lightBox組合
    $('.cp_slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 1500,
        pauseOnHover: true,
        pauseOnFocus: true,
        focusOnSelect: true,
        accessibility: true,
        lazyLoad: 'ondemand',
        ease: 'ease',
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
            }
        }, {
            breakpoint: 545,
            settings: {
                arrows: true,
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 480,
            settings: {
                arrows: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            }
        }]
    });
    $('.cp_slider').slickLightbox({
        caption: 'caption',
        lazyLoad: 'ondemand',
        useHistoryApi: 'true',
        ease: 'ease',
        lazy: true
    });
    // 
    $('.cppic_slider').slick({
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 1500,
        // pauseOnHover: true,
        // pauseOnFocus: true,
        // focusOnSelect: true,
        // accessibility: true,
        // lazyLoad: 'ondemand',
        // ease: 'ease',
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
            }
        }, {
            breakpoint: 545,
            settings: {
                arrows: true,
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 480,
            settings: {
                arrows: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            }
        }]
    });
    // cp_photo
    $('.Slider-for').on('init reInit afterChange', function(event, slick, currentSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $('.controls').html(i + '/' + slick.slideCount);
    });
    $('.Slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        swipe: false,
        swipeToSlide: false,
        lazyLoad: 'ondemand',
        asNavFor: '.Slider-nav',
        infinite: true
    });
    $('.Slider-nav').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        asNavFor: '.Slider-for',
        dots: true,
        arrows: true,
        lazyLoad: 'ondemand',
        focusOnSelect: true,
        infinite: true
    });

    // password_toggle
    var passShow = false;
    $('.password_toggle').each(function(index, el) {
        $(this).find('.btn-icon').off().click(function(e) {
            if (!passShow) {
                $(this).children('i').removeClass().addClass('i_show');
                $(this).parents('.password_toggle').find('input[type="password"]').attr('type', 'text');
                passShow = true;
                // console.log(passShow);
            } else {
                $(this).children('i').removeClass().addClass('i_hide');
                $(this).parents('.password_toggle').find('input[type="text"]').attr('type', 'password');
                passShow = false;
                // console.log(passShow);
            }
            e.preventDefault();
        });
    });

    //navigation readset收合區塊
    $('.mpfun').find('li').has('.readset').addClass('hasChild');
    var _navlistChild = $('.mpfun').find('li.hasChild');
    $('.mpfun>ul>li>a').click(function() {
        $(this).siblings('.readset').slideToggle();
    })
    _navlistChild.children('a').keyup(function() {
        $(this).siblings('.readset').fadeIn();
    });
    _navlistChild.find('.text_contrast li:last>a').focusout(function() {
        $(this).parents('.readset').hide();
    });
    $('.close_btn').click(function() {
        $(this).parent('.readset').hide();
    })


// 點外面關閉share
    $(document).on('touchend click', function(e) {
        var container = $('.header .mpfun');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('.header .mpfun .readset').hide();
        }
    });

});

//accordionqa
$(".accordionqa .accordionblock").each(function () {
  var _accordionItem = $(this).children(".question");
  var _openclose_btn = _accordionItem.children(".openclose_btn");
  var _answercontent = $(this).children(".answer");
  if (_answercontent.length == 0) {
    _openclose_btn.hide();
} else {
    function accordion3(e) {
      if (_answercontent.is(":hidden")) {
        _answercontent.slideDown();
        _openclose_btn.text("收合").addClass("open");
    } else {
        _answercontent.slideUp();
        _openclose_btn.text("展開").removeClass("open");
    }
}
_accordionItem.click(accordion3);
}
});

//fold收合區塊
$('.fold').find('div').has('.fold_box').addClass('hasChild');
var _foldChild = $('.fold').find('div.hasChild');
$('.fold .fold_btn').click(function() {
    $(this).siblings('.fold_box').slideToggle();
})
// _foldChild.children('button').keyup(function() {
//     $(this).siblings('.fold_box').fadeIn();
// });
_foldChild.find('.selbox').focusout(function() {
    $(this).parents('.fold_box').hide();
});


