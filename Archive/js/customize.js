// -----  基本功能開關   ---------------------------------------------------
topNav(); // 手機版顯示nav選單
//navSticky(); // 捲動時固定主選單
//fatFooter(); // fatFooter是否要展開
tabFunction('.tabSet'); // tab功能
scrollTables('table'); // table捲動功能
fontSize();
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
  fun: sideAccordion,
});

// 手風琴功能 進階查詢開合
accordionSlider({
  list: '.accordion2 .accordionList', // 問題區塊
  content: '.accordion2 .accordionContent', // 回答區塊
  autoSlider: false, // true 點選其他項目時會關閉已開啟的內容，false 需要再點一次才會關閉
  info: {
    open: '進階查詢', // 收合時顯示
    close: '簡易查詢', // 展開時顯示
  },
});

//// 手風琴功能 常見問題
accordionSlider({
  list: '.accordion3 .accordionList', // 問題區塊
  content: '.accordion3 .accordionContent', // 回答區塊
  autoSlider: false, // true 點選其他項目時會關閉已開啟的內容，false 需要再點一次才會關閉
  info: {
    open: '展開', // 收合時顯示
    close: '收合', // 展開時顯示
  },
});

//切換 lp list/grid
(function () {
  let lpStyle = document.querySelector('.lp');
  let list = document.querySelector('.btnListArray');
  let grid = document.querySelector('.btnGridArray');
  if (list !== null || list !== null) {
    list.addEventListener(
      'click',
      function () {
        lpStyle.classList.add('lpList');
        lpStyle.classList.remove('lpAlbum');
      },
      false
    );
    grid.addEventListener(
      'click',
      function () {
        lpStyle.classList.add('lpAlbum');
        lpStyle.classList.remove('lpList');
      },
      false
    );
  }
})();

//檢索後分類開關
(function () {
  let bottomBtn = document.querySelector('.btnFunnel');
  let leftBlock = document.querySelector('.leftBlock');
  let close = document.querySelector('.btnClose');
  let body = document.querySelector('body');
  if (bottomBtn !== null) {
    bottomBtn.addEventListener(
      'click',
      function () {
        leftBlock.classList.toggle('active');
        body.classList.toggle('fixed');
      },
      false
    );
    close.addEventListener(
      'click',
      function () {
        leftBlock.classList.toggle('active');
        body.classList.toggle('fixed');
      },
      false
    );
  }
})();

// accordion 客製功能
function sideAccordion(duration) {
  let accordion = document.querySelectorAll('.accordion1 .accordionContent');

  accordion.forEach((item) => {
    let ulList = item.querySelector('ul');
    let list = item.querySelectorAll('li');
    let moreBtn = item.querySelector('.btnMoreLess') || undefined;
    let moreBtnHeight = moreBtn !== undefined ? moreBtn.offsetHeight : '';
    list.forEach((item, index) => (index > 4 ? (item.style.display = `none`) : ''));

    let moreCheck = false;
    if (list.length > 5) {
      moreBtn.addEventListener('click', secFun);
    }
    function secFun() {
      let ogHeight = 0 + parseInt(window.getComputedStyle(ulList).paddingTop) + parseInt(window.getComputedStyle(ulList).paddingBottom);
      list.forEach((v, i) => {
        if (i < 5) {
          ogHeight += v.offsetHeight;
          ogHeight += parseInt(window.getComputedStyle(v).marginBottom);
        }
      });
      if (!moreCheck) {
        list.forEach((v) => (v.style.display = 'block'));
        let height = ulList.offsetHeight;
        ulList.style.height = `${ogHeight}px`;
        ulList.offsetHeight;
        ulList.style.transitionProperty = 'height';
        ulList.style.transitionDuration = `300ms`;
        ulList.style.height = `${height}px`;
        moreBtn.innerHTML = 'less';
        setTimeout(() => {
          ulList.style.removeProperty('height');
          ulList.style.removeProperty('transition-duration');
          ulList.style.removeProperty('transition-property');
        }, duration);
        moreCheck = true;
        console.log('a');
      } else {
        let height = ulList.offsetHeight;
        ulList.style.height = `${height}px`;
        ulList.offsetHeight;
        ulList.style.transitionProperty = 'height';
        ulList.style.transitionDuration = `300ms`;
        ulList.style.height = `${ogHeight}px`;
        setTimeout(() => {
          moreBtn.innerHTML = 'more';
          list.forEach((item, index) => (index > 4 ? (item.style.display = `none`) : ''));
          ulList.style.removeProperty('height');
          ulList.style.removeProperty('transition-duration');
          ulList.style.removeProperty('transition-property');
        }, duration);
        moreCheck = false;
      }
    }
  });
}

// -----  基本功能開關   ---------------------------------------------------

// 自行加入的JS請寫在這裡
(function () {
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

  //大圖輪播
  const sliderSwiper = new Swiper('.mpSlider .swiper', {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 8000, //輪播秒數
      pauseOnMouseEnter: false, //滑鼠移至swiper上停止
      disableOnInteraction: false, //移開後可以繼續autoPlay
    },
    // 切換點
    pagination: {
      el: '.mpSlider .swiper-dots',
      bulletElement: 'button',
      clickable: true,
    },
    // 切換箭頭
    navigation: {
      nextEl: '.mpSlider .swiperArrow.next', //自行設定樣式
      prevEl: '.mpSlider .swiperArrow.prev', //自行設定樣式
      disabledClass: 'swiperArrow-disabled', //不可點選樣式
    },
  });

  //分類瀏覽輪播
  const lpSwiper_1 = new Swiper('.lpSlider_1 .swiper', {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: false,
    // 切換點
    pagination: {
      el: '.lpSlider_1 .swiper-dots',
      bulletElement: 'button',
      clickable: true,
    },
    // 切換箭頭
    navigation: {
      nextEl: '.lpSlider_1 .swiperArrow.next', //自行設定樣式
      prevEl: '.lpSlider_1 .swiperArrow.prev', //自行設定樣式
      disabledClass: '.lpSlider_1 swiperArrow-disabled', //不可點選樣式
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
  const lpSwiper_2 = new Swiper('.lpSlider_2 .swiper', {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: false,
    // 切換點
    pagination: {
      el: '.lpSlider_2 .swiper-dots',
      bulletElement: 'button',
      clickable: true,
    },
    // 切換箭頭
    navigation: {
      nextEl: '.lpSlider_2 .swiperArrow.next', //自行設定樣式
      prevEl: '.lpSlider_2 .swiperArrow.prev', //自行設定樣式
      disabledClass: '.lpSlider_2 swiperArrow-disabled', //不可點選樣式
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
  const lpSwiper_3 = new Swiper('.lpSlider_3 .swiper', {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: false,
    // 切換點
    pagination: {
      el: '.lpSlider_3 .swiper-dots',
      bulletElement: 'button',
      clickable: true,
    },
    // 切換箭頭
    navigation: {
      nextEl: '.lpSlider_3 .swiperArrow.next', //自行設定樣式
      prevEl: '.lpSlider_3 .swiperArrow.prev', //自行設定樣式
      disabledClass: '.lpSlider_3 swiperArrow-disabled', //不可點選樣式
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

  //廣告輪播
  const adSwiper = new Swiper('.adSlider .swiper', {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: false,
    // 切換點
    pagination: {
      el: '.adSlider .swiper-dots',
      bulletElement: 'button',
      clickable: true,
    },
    // 切換箭頭
    navigation: {
      nextEl: '.adSlider .swiperArrow.next', //自行設定樣式
      prevEl: '.adSlider .swiperArrow.prev', //自行設定樣式
      disabledClass: '.adSlider swiperArrow-disabled', //不可點選樣式
    },
    breakpoints: {
      100: {
        slidesPerView: 2,
      },
      767: {
        slidesPerView: 3,
      },
      1000: {
        slidesPerView: 4,
      },
    },
  });

  //跑馬燈
  const marqueeSwiper = new Swiper('.marquee .swiper', {
    direction: 'vertical',
    // 切換點
    // 切換箭頭
    navigation: {
      nextEl: '.marquee .marquee-arrow.marquee-next', //自行設定樣式
      prevEl: '.marquee .marquee-arrow.marquee-prev', //自行設定樣式
      disabledClass: '.marquee marquee-arrow-disabled', //不可點選樣式
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
})();
