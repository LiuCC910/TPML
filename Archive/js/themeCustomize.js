// -----  基本功能開關   ---------------------------------------------------
//topNav(); // 手機版顯示nav選單
navSticky(); // 捲動時固定主選單
//fatFooter(); // fatFooter是否要展開
tabFunction('.tabSet'); // tab功能
scrollTables('table'); // table捲動功能
//fontSize();
tableAddDataAttributes({
    elemClass: '.tableList', // 目標table
    dataName: 'title', // tableList樣式 加上 data-title
});

// 手風琴功能 檢索後分類
accordionSlider({
    list: '.accordion1 .accordionList', // 問題區塊
    content: '.accordion1 .accordionContent', // 回答區塊
    autoSlider: false, // true 點選其他項目時會關閉已開啟的內容，false 需要再點一次才會關閉
    info: {
        open: '展開', // 收合時顯示
        close: '收合', // 展開時顯示
    },
});

//切換 lp list/grid
(function() {
    let lpStyle = document.querySelector('.lp');
    let list = document.querySelector('.btnListArray');
    let grid = document.querySelector('.btnGridArray');
    if (list !== null || list !== null) {
        list.addEventListener(
            'click',
            function() {
                lpStyle.classList.add('lpList');
                lpStyle.classList.remove('lpAlbum');
            },
            false
        );
        grid.addEventListener(
            'click',
            function() {
                lpStyle.classList.add('lpAlbum');
                lpStyle.classList.remove('lpList');
            },
            false
        );
    }
})();

// -----  基本功能開關   ---------------------------------------------------

// 自行加入的JS請寫在這裡
(function() {
    const sliderSwiper = new Swiper('.picSlider .swiper', {
        slidesPerView: 1,
        loop: true,
        // 切換點
        pagination: {
            el: '.picSlider .swiper-dots',
            bulletElement: 'button',
            clickable: true,
        },
        // 切換箭頭
        navigation: {
            nextEl: '.picSlider .swiperArrow.next', //自行設定樣式
            prevEl: '.picSlider .swiperArrow.prev', //自行設定樣式
            disabledClass: 'swiperArrow-disabled', //不可點選樣式
        },
    });
    //cp輪播
    const cpSwiper = new Swiper('.cpSlider .swiper', {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: false,
        // 切換點
        pagination: {
            el: '.cpSlider .swiper-dots',
            bulletElement: 'button',
            clickable: true,
        },
        // 切換箭頭
        navigation: {
            nextEl: '.cpSlider .swiperArrow.next', //自行設定樣式
            prevEl: '.cpSlider .swiperArrow.prev', //自行設定樣式
            disabledClass: 'swiperArrow-disabled', //不可點選樣式
        },
        breakpoints: {
            100: {
                slidesPerView: 1,
            },
            767: {
                slidesPerView: 2,
            },
            1000: {
                slidesPerView: 4,
            },
        },
    });

    //cp_photo
    const navSlider = new Swiper('.navSlider .swiper', {
        lazy: true, // lazy load
        preloadImages: false, // 多筆設定lazy時須設定
        centeredSlides: false, // 多筆設定lazy時須設定
        slidesPerView: 4,
        // watchSlidesProgress: true,
        navigation: {
            nextEl: '.navSlider .nextSlider', //下一張class，無障礙設定關係需要增加.nextSlider
            prevEl: '.navSlider .prevSlider', //前一張class，無障礙設定關係需要增加.prevSlider
            disabledClass: 'swiperArrow-disabled', //不可點選樣式
        },
    });

    const sliderFor = new Swiper('.sliderFor .swiper', {
        slidesPerView: 1, //顯示張數
        effect: 'fade', //淡入
        fadeEffect: {
            crossFade: true, //上一張淡出，false上一張不淡出，下一張疊在上方
        },
        pagination: {
            el: '.sliderFor .pagination',
            type: 'fraction', //顯示分頁
        },
        lazy: true,
        thumbs: {
            swiper: navSlider, //設定指向到哪個swiper，使用另一個設定的參數
        },
    });

    // var swiper = new Swiper('.gridSwiper', {
    //     slidesPerView: 1,
    //     grid: {
    //         rows: 2,
    //     },
    //     spaceBetween: 30,
    //     pagination: {
    //         el: ".swiper-pagination",
    //         clickable: true,
    //     },
    // });
    const gridSlider = new Swiper('.gridSlider .swiper', {
        slidesPerView: 1,
        loop: false,
        // 切換點
        pagination: {
            el: '.gridSlider .swiper-dots',
            bulletElement: 'button',
            clickable: true,
        },
        // 切換箭頭
        navigation: {
            nextEl: '.gridSlider .swiperArrow.next', //自行設定樣式
            prevEl: '.gridSlider .swiperArrow.prev', //自行設定樣式
            disabledClass: 'swiperArrow-disabled', //不可點選樣式
        },
    });
})();

// 依照畫面尺寸調整h1位置
(function() {
    let windowSmall = 768; //以下 h1 放到 .main，以上放到 .header .container
    let windowWidth = window.outerWidth;
    const h1 = document.querySelector('h1').cloneNode(true);
    const menu = document.querySelector('.mainMenu');
    const header = document.querySelector('.header .container');
    const main = document.querySelector('.main');
    let cloneOk = false;

    window.addEventListener('load', h1ChangePlace);
    window.addEventListener('resize', h1ChangePlace);

    function h1ChangePlace() {
        windowWidth = window.outerWidth;
        if (windowSmall >= windowWidth && !cloneOk) {
            main.prepend(h1);
            header.querySelector('h1') != null ? header.querySelector('h1').remove() : '';
            cloneOk = true;
        } else if (windowSmall <= windowWidth && cloneOk) {
            header.insertBefore(h1, menu);
            cloneOk = false;
            main.querySelector('h1') != null ? main.querySelector('h1').remove() : '';
        }
    }
})();