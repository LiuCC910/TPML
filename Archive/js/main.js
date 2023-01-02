// -----------------------------------------------------------------------
// -----  nojs 先移除  ----------------------------------------------------
// -----------------------------------------------------------------------

const _webHtml = document.documentElement;
_webHtml.classList.remove('no-js');

// -----------------------------------------------------------------------
// -----  共用效果  -------------------------------------------------------
// -----------------------------------------------------------------------

const slider = (function () {
  let Slider = {};

  function TimerManager() {
    this.timers = [];
    this.args = [];
    this.isTimerRun = false;
  }
  TimerManager.makeTimerManage = function (element) {
    if (!element.TimerManage || element.TimerManage.constructor !== TimerManager) {
      element.TimerManage = new TimerManager();
    }
  };
  TimerManager.prototype.add = function (timer, args) {
    this.timers.push(timer);
    this.args.push(args);
    this.timerRun();
  };
  TimerManager.prototype.timerRun = function () {
    if (!this.isTimerRun) {
      let timer = this.timers.shift(),
        args = this.args.shift();
      if (timer && args) {
        this.isTimerRun = true;
        timer(args[0], args[1]);
      }
    }
  };
  TimerManager.prototype.next = function () {
    this.isTimerRun = false;
    this.timerRun();
  };

  function jsSlideUp(element, time) {
    if (element.offsetHeight > 0) {
      let totalHeight = element.offsetHeight;
      let currentHeight = totalHeight;
      let reduceValue = totalHeight / (time / 10);
      element.style.transition = 'height ' + time + ' ms';
      element.style.overflow = 'hidden';
      let timer = setInterval(function () {
        currentHeight -= reduceValue;
        element.style.height = currentHeight + 'px';
        if (currentHeight <= 0) {
          clearInterval(timer);
          element.style.display = 'none';
          element.style.height = totalHeight + 'px';
          if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
            element.TimerManage.next();
          }
        }
      }, 10);
    } else {
      if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
        element.TimerManage.next();
      }
    }
  }

  function jsSlideDown(element, time) {
    if (element.offsetHeight <= 0) {
      element.style.display = 'block';
      element.style.transition = 'height' + time + ' ms';
      element.style.overflow = 'hidden';
      let totalHeight = element.offsetHeight;
      let currentHeight = 0;
      element.style.height = '0px';
      let addValue = totalHeight / (time / 10);
      let timer = setInterval(function () {
        currentHeight += addValue;
        element.style.height = currentHeight + 'px';
        if (currentHeight >= totalHeight) {
          clearInterval(timer);
          element.style.height = totalHeight + 'px';
          if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
            element.TimerManage.next();
          }
        }
      }, 10);
    } else {
      if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
        element.TimerManage.next();
      }
    }
  }
  // the interface about slideUp method
  Slider.jsSlideUp = function (element) {
    TimerManager.makeTimerManage(element);
    element.TimerManage.add(jsSlideUp, arguments);
    return this;
  };
  // the interface about slideDown method
  Slider.jsSlideDown = function (element) {
    TimerManager.makeTimerManage(element);
    element.TimerManage.add(jsSlideDown, arguments);
    return this;
  };
  return Slider;
})();

function jsFadeIn(element, speed) {
  let val = 0;
  let request;
  element.style.display = 'block';
  requestAnimationFrame(fade);

  function fade() {
    val += speed || 10;
    if (val <= 100) {
      element.style.opacity = val / 100;
      request = requestAnimationFrame(fade);
    } else if (val >= 100) {
      cancelAnimationFrame(request);
    }
  }
}

function jsFadeOut(element, speed) {
  let val = 100;
  let request;
  requestAnimationFrame(fade);

  function fade() {
    val -= speed || 5;
    if (val >= 1) {
      element.style.opacity = val / 100;
      request = requestAnimationFrame(fade);
    } else if (val <= 0) {
      cancelAnimationFrame(request);
      element.style.opacity = '0';
      element.style.display = 'none';
    }
  }
}

function jsAddClass(element, className) {
  if (element.classList) element.classList.add(className);
  else if (!hasClass(element, className)) {
    element.className += ' ' + className;
  }
}

function jsRemoveClass(element, className) {
  if (element.classList) element.classList.remove(className);
  else if (hasClass(element, className)) {
    let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    element.className = element.className.replace(reg, ' ');
  }
}

// jsParents 可使用tag或是class，單筆可以直接使用，多筆需要用forEach去調用每一個parents
function jsParents(element, elementCheck) {
  const elementParentsCheck = elementCheck || null;
  const matched = [];
  const elementArr = [];
  !element.item ? elementArr.push(element) : (elementArr = element);
  elementArr.forEach((s) => {
    let current = s;
    while (current.parentNode != null && current.parentNode != document.documentElement) {
      matched.push(current.parentNode);
      current = current.parentNode;
    }
  });
  const check = matched.filter((i) => {
    return i.localName == elementParentsCheck ? i : i.classList.contains(elementParentsCheck) ? i : elementParentsCheck === null ? i : '';
  });
  return check.length === 1 ? check[0] : check;
}

// -----------------------------------------------------------------------
// -----  MENU初始化 ------------------------------------------------------
// -----------------------------------------------------------------------

function menu() {
  // --- menu初始化 新增側欄選單
  const body = document.querySelector('body');
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.style = ';opacity:0';
  sidebar.innerHTML = '<div class="mobileArea"><button type="button" class="sidebarClose">關閉</button></div><div class="menuOverlay"></div>';
  body.prepend(sidebar);

  const mainMenu = document.querySelector('.mainMenu');
  const hasChild = mainMenu.querySelectorAll('li ul');
  hasChild.forEach((i) => {
    i.parentNode.classList.add('hasChild');
  });

  // --- menu初始化 新增側欄選單按鈕
  const sidebarCtrlBtn = document.createElement('button');
  sidebarCtrlBtn.className = 'sidebarCtrlBtn';
  sidebarCtrlBtn.innerHTML = '側欄選單<span></span><span></span><span></span>';
  sidebarCtrlBtn.setAttribute('type', 'button');

  // --- menu初始化 新增搜尋按鈕
  const searchCtrlBtn = document.createElement('button');
  const siteHeader = document.querySelector('.header .container');
  searchCtrlBtn.className = 'searchCtrlBtn';
  searchCtrlBtn.innerHTML = '查詢';
  searchCtrlBtn.setAttribute('type', 'button');
  siteHeader.prepend(searchCtrlBtn, sidebarCtrlBtn);

  // --- menu初始化 複製手機版側欄選單
  const mobileArea = document.querySelector('.mobileArea');
  const cloneMenu = mainMenu.cloneNode(true);
  cloneMenu.classList.add('sideMainMenu');
  cloneMenu.classList.remove('mainMenu', 'megaMenu', 'menu');
  mobileArea.append(cloneMenu);

  // --- 複製搜尋到手機版側欄
  const search = document.querySelector('.search');
  if (search !== null) {
    const cloneSearch = search.cloneNode(true);
    cloneSearch.removeAttribute('style');
    cloneSearch.classList.add('mobileSearch');
    cloneSearch.classList.remove('search');
    body.prepend(cloneSearch);
  }
}
menu();

// -----------------------------------------------------------------------
// ----- 複製手機版nav選單 -------------------------------------------------
// -----------------------------------------------------------------------

function topNav() {
  let mobileArea = document.querySelector('.mobileArea');
  let nav = document.querySelector('.navigation');
  let cloneNav = nav.cloneNode(true);
  mobileArea.append(cloneNav);
  const sideLanguage = document.querySelector('.mobileArea .fontSize');
  sideLanguage !== null ? sideLanguage.remove() : '';
}
//topNav();

// -----------------------------------------------------------------------
// ----- 手機版本search設定 ------------------------------------------------
// -----------------------------------------------------------------------

function mobileSearch(obj) {
  let searchOpen = false;
  const body = document.querySelector('body');
  const searchCtrlBtn = obj.searchCtrlBtn;
  const mobileSearch = document.querySelector('.mobileSearch');

  const searchBg = document.createElement('div');
  searchBg.className = 'searchBg';
  body.prepend(searchBg);

  searchCtrlBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileSearch.classList.toggle('active');
    searchBg.classList.toggle('active');
    searchOpen = true;
    // --- 點擊搜尋區以外的區塊
    // --- 如果點在外面 則 searchMode 狀態改為false
  });
  searchBg.addEventListener('click', (e) => {
    if (searchOpen) {
      mobileSearch.classList.remove('active');
      searchBg.classList.remove('active');
    }
  });

  window.addEventListener('resize', (e) => {
    setTimeout(() => {
      searchOpen = false;
      mobileSearch !== null ? mobileSearch.classList.remove('active') : '';
    }, 50);
  });
}
mobileSearch({
  searchCtrlBtn: document.querySelector('.searchCtrlBtn'),
});

// -----------------------------------------------------------------------
// ----- 手機桌機版本切換及手機版menu設定 -------------------------------------
// -----------------------------------------------------------------------

function mainMenuSetup() {
  const body = document.querySelector('body');
  const windowSmall = 768;
  const sidebar = document.querySelector('.sidebar');
  const mobileSearch = document.querySelector('.mobileSearch');
  const sidebarClose = document.querySelector('.sidebarClose');
  const sidebarCtrlBtn = document.querySelector('.sidebarCtrlBtn');
  const menuOverlay = document.querySelector('.menuOverlay');
  const mobileArea = document.querySelector('.mobileArea');
  const mobileAreaOut = mobileArea.offsetWidth;
  let windowWidth = window.outerWidth;
  let searchMode = false;

  // ---  PC版設定
  const menuLiHasChild = document.querySelector('.header .mainMenu').querySelectorAll('li.hasChild');
  const menuLi = document.querySelectorAll('.header .mainMenu > ul > li');
  // ---  手機版設定
  const asideMenu = document.querySelector('.sideMainMenu');
  const asideMenuLi = asideMenu.querySelectorAll('li');
  const asideMenuUl = asideMenu.querySelector('ul');
  const asideMenuNextUl = asideMenuUl.querySelectorAll('ul');
  const asideMenuNextUl1 = [];
  const asideMenuNextUl2 = [];
  const asideMenuNextUl3 = [];

  // ---  判斷PC版選單超過畫面時左邊增加.leftSlider
  function checkUlWidth() {
    // --- 計算
    let menuLeft = document.querySelector('.header .container').offsetLeft;
    menuLi.forEach((v, i) => {
      // let menuLeft = v.getBoundingClientRect().left;
      // console.log(menuLeft);
      let menuLiLeft = v.offsetLeft;
      let leftWidth = v.offsetWidth * v.querySelectorAll('ul').length;
      menuLiLeft + leftWidth + menuLeft > windowWidth ? v.classList.add('leftSlider') : v.classList.remove('leftSlider');
    });
  }

  // --- 手機版抓取ul設定各層的class
  [...asideMenuUl.children]
    .filter((child) => {
      return child.classList.contains('hasChild');
    })
    .forEach((i) => {
      asideMenuNextUl1.push(i.querySelector('ul'));
    });

  asideMenuNextUl1.forEach((s) => {
    [...s.children]
      .filter((child) => {
        return child.classList.contains('hasChild');
      })
      .forEach((i) => {
        asideMenuNextUl2.push(i.querySelector('ul'));
      });
  });

  asideMenuNextUl2.forEach((s) => {
    [...s.children]
      .filter((child) => {
        return child.classList.contains('hasChild');
      })
      .forEach((i) => {
        asideMenuNextUl3.push(i.querySelector('ul'));
      });
  });

  // --- 設定所有UL的高度，有高度才會有縮起來得效果，最多四層
  sidebar.style = 'display:block;opacity:0';
  mobileArea.style = `transform: translateX(${mobileAreaOut * -1}px)`;
  asideMenuUl.classList.add('firstLv');
  asideMenuNextUl.forEach((i) => {
    i.style.position = 'absolute';
  });
  asideMenuNextUl1.forEach((i) => {
    i.classList.add('secondLv');
    i.dataset.secondHeight = i.offsetHeight;
    i.style = 'height:0';
  });
  asideMenuNextUl2.forEach((i) => {
    i.classList.add('thirdLv');
    i.dataset.thirdHeight = i.offsetHeight;
    i.style = 'height:0';
  });
  asideMenuNextUl3.forEach((i) => {
    i.classList.add('fourthLv');
    i.dataset.fourthHeight = i.offsetHeight;
    i.style = 'height:0';
  });
  sidebar.style = 'display:none;opacity:1;';

  // --- 手機版選單開合功能
  asideMenu.querySelectorAll('.hasChild').forEach((i) => {
    i.addEventListener('click', (e) => {
      e.preventDefault();
      const siblings = [...i.parentNode.children].filter((child) => {
        return child !== i;
      });
      const content = i.querySelector('ul');
      const secondHeight = content.dataset.secondHeight || 0;
      const thirdHeight = content.dataset.thirdHeight || 0;
      const fourthHeight = content.dataset.fourthHeight || 0;
      if (!i.classList.contains('active')) {
        i.classList.add('active');
        if (i.parentNode.classList.contains('firstLv')) {
          content.style.height = `${secondHeight}px`;
        } else if (i.parentNode.classList.contains('secondLv')) {
          i.parentNode.style.height = `${Number(i.parentNode.dataset.secondHeight) + Number(thirdHeight)}px`;
          content.style.height = `${thirdHeight}px`;
        } else if (i.parentNode.classList.contains('thirdLv')) {
          jsParents(i, 'secondLv').style.height = `${Number(jsParents(i, 'secondLv').dataset.secondHeight) + Number(i.parentNode.dataset.thirdHeight) + Number(fourthHeight)}px`;
          jsParents(i, 'secondLv').style.height = `${Number(jsParents(i, 'secondLv').dataset.secondHeight) + Number(i.parentNode.dataset.thirdHeight) + Number(fourthHeight)}px`;
          i.parentNode.style.height = `${Number(i.parentNode.dataset.thirdHeight) + Number(fourthHeight)}px`;
          content.style.height = `${fourthHeight}px`;
        }
      }
      siblings.forEach((x) => {
        x.classList.remove('active');
        x.querySelectorAll('ul').forEach((s) => {
          s.style.height = '0';
          s.parentNode.classList.remove('active');
        });
      });
    });
  });

  // --- 點擊選單按鈕 執行 展開側邊選單函式
  sidebarCtrlBtn.addEventListener('click', (e) => {
    showSidebar();
    e.preventDefault();
    mobileSearch !== null ? mobileSearch.classList.remove('active') : '';
  });

  menuOverlay.addEventListener('click', (e) => {
    jsFadeOut(menuOverlay);
    hideSidebar();
  });
  sidebarClose.addEventListener('click', (e) => {
    jsFadeOut(menuOverlay);
    hideSidebar();
    mobileSearch !== null ? mobileSearch.classList.remove('active') : '';
  });

  // --- PC版設定
  function pcSet() {
    let language = document.querySelector('.language ul');
    hideSidebar();
    body.classList.remove('noscroll');
    // mobileSearch !== null ? (mobileSearch.style.display = 'none') : '';
    language !== null ? (language.style.display = 'none') : '';
    // --- 副選單滑出

    menuLiHasChild.forEach((i) => {
      i.addEventListener('mouseenter', (e) => {
        i.classList.add('active');
      });
      i.addEventListener('mouseleave', (e) => {
        i.classList.remove('active');
      });
    });

    menuLiHasChild.forEach((i) => {
      i.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }
  pcSet();

  // --- 切換 PC/Mobile 選單
  function switchMenu() {
    if (windowWidth > windowSmall) {
      pcSet();
      fontSize();
    } else {
      body.classList.remove('largeSize', 'medium_size');
    }
  }

  // --- 行動版/電腦版切換
  window.addEventListener('resize', switchResizeFunction);
  window.addEventListener('load', switchResizeFunction);

  function switchResizeFunction() {
    setTimeout(() => {
      // mobileSearch !== null ? (mobileSearch.style.display = 'none') : '';
      windowWidth = window.outerWidth;
      switchMenu();
      checkUlWidth();
      hideSidebar();
    }, 50);
  }

  // --- 展開側邊選單函式
  function showSidebar() {
    sidebar.style = 'display:block;opacity:1';
    mobileArea.style.display = 'block';

    requestAnimationFrame(() => {
      mobileArea.style = `transform: translateX(0px);`;
    });
    setTimeout(() => {
      mobileArea.classList.add('open');
    }, 50);

    body.classList.add('noscroll');
    menuOverlay.classList.add('active');
    // mobileSearch !== null ? (mobileSearch.style.display = 'none') : '';
    searchMode = false;
    jsFadeIn(menuOverlay);
  }

  // --- 隱藏側邊選單函式
  function hideSidebar() {
    window.requestAnimationFrame(() => {
      mobileArea.style = `transform: translateX(${mobileAreaOut * -1}px);`;
    });
    setTimeout(() => {
      sidebar.style.display = 'none';
    }, 300);

    mobileArea.classList.remove('open');
    body.classList.remove('noscroll');
    menuOverlay.classList.remove('active');
    asideMenuNextUl.forEach((i) => {
      i.style.height = '0px';
    });

    asideMenuLi.forEach((i) => {
      i.classList.remove('active');
    });
  }
}
mainMenuSetup();

// -----------------------------------------------------------------------
// -----  menu 訊息區塊 sticky  -------------------------------------------
// -----------------------------------------------------------------------

function navSticky() {
  const windowWidthSmall = 768;
  const mainMenu = document.querySelector('.mainMenu');
  const main = document.querySelector('.main');
  let windowWidth = window.outerWidth;
  let menuHeight = Math.floor(mainMenu.offsetHeight);
  let mainMenuTop = Math.floor(mainMenu.getBoundingClientRect().top + window.scrollY);
  let offsetTop = Math.floor(mainMenuTop) || null;

  // --- 取menu高度
  jsScroll(mainMenuTop);
  jsResize(mainMenuTop);
  reload(mainMenuTop);

  // --- menu 的 sticky函式
  function sticky(mainMenuTop) {
    offsetTop = Math.floor(mainMenuTop) || null;
    // --- 如果 offsetTop 不等於 null 則運行下方函式
    if (offsetTop != null) {
      if (windowWidth >= windowWidthSmall && window.scrollY > offsetTop) {
        mainMenu.classList.add('sticky');
        main.style = `padding-top: ${menuHeight}px`;
      } else {
        mainMenu.classList.remove('sticky');
        main.removeAttribute('style');
      }
    }
  }

  // --- 當 scroll 觸發
  function jsScroll(mainMenuTop) {
    // --- scroll 時執行 menu_stickyNavbar 並請傳入 menu 距離上方的高度的參數
    window.addEventListener('scroll', (e) => {
      sticky(mainMenuTop);
    });
  }

  // --- 當 resize 觸發 判斷 menu的種類
  function jsResize(mainMenuTop) {
    // --- 如果 有 menu 的話 執行固定 menu_stickyNavbar
    window.addEventListener('resize', (e) => {
      // --- 算出 menu 距離上方的高度
      offsetTop = Math.floor(mainMenuTop) || null;
      setTimeout(() => {
        main.removeAttribute('style');
        sticky(offsetTop);
      }, 50);
    });
  }

  function reload(mainMenuTop) {
    offsetTop = Math.floor(mainMenuTop) || null;
    window.onload = sticky(offsetTop);
  }
}
// navSticky();

// -----------------------------------------------------------------------
// -----  menu的無障礙tab設定 a11yKeyMenu  ---------------------------------
// -----------------------------------------------------------------------

function a11yKeyMenu() {
  const mainMenu = document.querySelector('.mainMenu') || null;

  // --- keyup時
  const control = mainMenu.querySelectorAll('li');
  control.forEach((i) => {
    i.addEventListener('keyup', (e) => {
      const siblings = Array.prototype.filter.call(i.parentNode.children, (child) => {
        return child !== i;
      });

      siblings.forEach((x) => {
        x.classList.remove('active');
        x.querySelectorAll('ul').forEach((s) => {
          s.style.display = 'none';
        });
      });
    });
  });

  // --- 不focus時
  const lastA = mainMenu.querySelectorAll('a').length - 1;
  mainMenu.querySelectorAll('a')[lastA].addEventListener('focusout', () => {
    mainMenu.querySelectorAll('li').forEach((i) => {
      i.classList.remove('active');
    });
  });

  // --- child keyup時
  const childControl = mainMenu.querySelectorAll('li.hasChild > a');

  childControl.forEach((i) => {
    i.addEventListener('keyup', (e) => {
      i.parentNode.querySelector('ul').removeAttribute('style');
      i.parentNode.classList.add('active');
    });
  });
}
a11yKeyMenu();

// -----------------------------------------------------------------------
// -----  notice訊息區塊   -------------------------------------------------
// -----------------------------------------------------------------------

document.querySelectorAll('[class*="notice"] a.close').forEach((i) => {
  i.addEventListener('click', (e) => {
    i.parentNode.style.display = 'none';
    e.preventDefault();
  });
});

// -----------------------------------------------------------------------
// -----  fatFooter   ----------------------------------------------------
// -----------------------------------------------------------------------

function fatFooter(obj) {
  const el = document.querySelector('.btnFatFooter') || null; // --- 控制的對象
  const fontBtn = document.querySelectorAll('.fontSize ul li a');

  function fatFooterInit() {
    // --- 抓取UI高度 css樣式修改樣式重新抓取高度
    const _navUl = el.parentNode.querySelectorAll('nav ul li ul');
    setTimeout(() => {
      _navUl.forEach((i) => {
        i.setAttribute('style', '');
        let _itemHeight = i.offsetHeight;
        i.dataset.itemHeight = _itemHeight;
        if (Number(_itemHeight) !== 0) {
          i.style.height = `${Number(i.dataset.itemHeight)}px`;
        } else {
          i.style.height = '0px';
        }
      });
    }, 20);
  }

  function toggleFatFooter() {
    const _navUl = el.parentNode.querySelectorAll('nav ul li ul');
    _navUl.forEach((i) => {
      if (i.offsetHeight !== 0) {
        i.style.height = '0px';
        el.innerHTML = '收合/CLOSE';
        el.setAttribute('name', '收合選單/CLOSE');
      } else {
        i.style.height = `${i.dataset.itemHeight}px`;
        el.innerHTML = '展開/OPEN';
        el.setAttribute('name', '展開選單/OPEN');
      }
    });
    el.classList.toggle('close');
  }
  fatFooterInit();
  // --- 點擊時
  el.addEventListener('click', toggleFatFooterEle);

  function toggleFatFooterEle() {
    setTimeout(() => {
      el.addEventListener('click', toggleFatFooterEle);
    }, 500);
    el.removeEventListener('click', toggleFatFooterEle);
    toggleFatFooter();
  }

  window.addEventListener('resize', () => {
    fatFooterInit();
  });
  fontBtn.forEach((i) => {
    i.addEventListener('click', function () {
      fatFooterInit();
      el.innerHTML = '展開/OPEN';
      el.setAttribute('name', '展開選單/OPEN');
      el.classList.remove('close');
    });
  });
}
// fatFooter();

// -----------------------------------------------------------------------
// -----  多組Tab   ------------------------------------------------------
// -----------------------------------------------------------------------

function tabFunction(elem) {
  const activeClass = 'active'; // --- 啟動的 class
  const tabSet = document.querySelectorAll(elem); // --- tab名稱

  tabSet.forEach((a) => {
    const tabBtn = a.querySelectorAll('.tabItems button'); // --- 頁籤按鈕
    const tabBtnLength = tabBtn.length; // --- 頁籤按鈕數量
    const tabContent = a.querySelectorAll('.tabContentGroup .tabContent'); // --- 頁籤內容
    tabBtn[0].classList.add('active');
    tabContent[0].classList.add('active');

    tabBtn.forEach((v, i) => {
      const thisBtn = tabBtn[i]; // --- 綁定這一個頁籤按鈕
      const thisContent = tabContent[i]; // --- 綁定這一個頁籤內容
      const thisPrevItem = tabContent[i - 1]; // --- 綁定前一個頁籤按鈕
      const itemAllA = thisContent.querySelectorAll('[href], input'); // --- 這一個頁籤內容所有a和input項目
      let prevItemAllA;
      if (thisPrevItem !== undefined) {
        prevItemAllA = thisPrevItem.querySelectorAll('[href], input'); // --- 前一個頁籤內容所有a和input項目
      }
      const isFirstTab = i === 0; // --- 如果是第一個頁籤
      const isLastTab = i === tabBtnLength - 1; // --- 如果是最後一個頁籤
      const itemFirstA = itemAllA[0]; // --- 頁籤內容第一個a或是input
      const itemLastA = itemAllA[itemAllA.length - 1]; // --- 頁籤內容最後一個a或是input
      let prevItemLastA;
      if (thisPrevItem !== undefined) {
        prevItemLastA = prevItemAllA[prevItemAllA.length - 1]; // --- 前一個頁籤的最後一個a或是input
      }

      // --- thisBtn頁籤觸發focus內容裡的第一個a
      thisBtn.addEventListener('keydown', (e) => {
        // --- 頁籤第幾個按鈕觸發時
        if (e.which === 9 && !e.shiftKey) {
          // --- e.which偵測按下哪個案件，9代表tab，shiftKey代表shift
          e.preventDefault();
          startTab(i, tabBtn, tabContent); // --- 啟動頁籤切換功能
          if (itemAllA.length) {
            // --- type number = true，0是false
            itemFirstA.focus(); // --- 第一個a或是input focus
          } else {
            tabBtn[i + 1].focus(); // --- 當內容沒有a或是input跳轉下一個tab
          }
        } else if (e.which === 9 && e.shiftKey && !isFirstTab) {
          e.preventDefault();

          startTab(i - 1, tabBtn, tabContent); // --- 啟動頁籤切換功能
          if (prevItemAllA.length) {
            prevItemLastA.focus(); // --- 前一個頁籤內容的最後一個a或是input focus
          } else {
            tabBtn[i - 1].focus(); // --- 當內容沒有a或是input跳轉上一個tab
          }
        }
      });

      // --- 當按下shift+tab且為該內容的第一個a或是input
      // --- 將focus目標轉回tab頁籤上，呼叫上方功能startTab(i - 1);往前一個頁籤
      if (itemFirstA !== undefined) {
        itemFirstA.addEventListener('keydown', (e) => {
          if (e.which === 9 && e.shiftKey) {
            e.preventDefault();
            tabBtn[i].focus();
          }
        });
      }
      // --- 當按下tab且為該內容的最後一個a或是input
      // --- focus到下一個頁籤
      if (itemLastA !== undefined) {
        itemLastA.addEventListener('keydown', (e) => {
          if (e.which === 9 && !e.shiftKey && !isLastTab) {
            e.preventDefault();
            tabBtn[i + 1].focus();
          }
        });
      }

      // --- 滑鼠點擊事件
      tabBtn[i].addEventListener(
        'click',
        (e) => {
          startTab(i, tabBtn, tabContent);
        },
        false
      );
    });
  });

  function startTab(now, tabBtn, tabContent) {
    if (tabBtn !== undefined) {
      tabBtn.forEach((i) => {
        i.classList.remove(activeClass);
      });
      tabBtn[now].classList.add(activeClass);
      // --- 頁籤按鈕增加指定class(active)，其他頁籤移除指定class

      tabContent.forEach((i) => {
        i.classList.remove(activeClass);
      });
      tabContent[now].classList.add(activeClass);
      // --- 顯示當下頁籤內，隱藏其他內容
    }
  }
}

// -----------------------------------------------------------------------
// -----  FontSize   -----------------------------------------------------
// -----------------------------------------------------------------------

function fontSize() {
  const el = document.querySelectorAll('.fontSize') || null; // --- 控制的對象
  const control = document.querySelector('body') || null; // --- 控制的對象名稱

  // --- 點擊文字大小按鈕
  el.forEach((i) => {
    i.querySelectorAll('a').forEach((v) => {
      // --- 移除 active 的 class 名稱
      function removeActiveClass() {
        const _parentEle = i.parentNode.parentNode;
        _parentEle.querySelectorAll('a').forEach((i) => {
          i.classList.remove('active');
        });
      }
      i.addEventListener('click', (e) => {
        removeActiveClass();
        createCookie('FontSize', `${e.target.className}`, 356);
        addChangeClass(e.target.className);
        jsAddClass(e.target, 'active');
      });
    });
  });

  function addChangeClass(targetName) {
    if (control === null) {
      return;
    }
    switch (targetName) {
      case 'small':
        control.classList.remove('largeSize', 'medium_size');
        control.classList.add('smallSize');
        break;
      case 'medium':
        control.classList.remove('smallSize', 'largeSize');
        control.classList.add('medium_size');
        break;
      case 'large':
        control.classList.remove('smallSize', 'medium_size');
        control.classList.add('largeSize');
        break;
    }
  }

  // --- 創造新的 字體大小設定
  function createCookie(name, value, days) {
    let _expires;
    const _date = new Date();
    if (days) {
      _date.setTime(_date.getTime() + days * 24 * 60 * 60 * 1000);
      _expires = '; expires=' + _date.toGMTString();
    } else {
      _expires = '';
    }
    document.cookie = name + '=' + value + _expires + '; path=/';
  }

  // --- 讀取瀏覽器上 字體大小設定
  function readCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // --- 初始化 字體大小設定
  window.addEventListener('load', (e) => {
    const _cookie = readCookie('FontSize');
    // --- 如果沒有_cookie 則預設值為'medium'
    if (_cookie == null) {
      _cookie = 'medium';
    }
    document.querySelectorAll(`.${_cookie}`).forEach((i) => {
      i.click();
      e.preventDefault();
    });
  });
}
// fontSize({
//   name: document.querySelectorAll('.fontSize'), // 按鈕列表名稱
//   control: document.querySelector('body'), // 控制的對象名稱
// });

// -----------------------------------------------------------------------
// -----  置頂go to top   -------------------------------------------------
// -----------------------------------------------------------------------

function scrollToTop(obj) {
  const el = obj.name || null; // --- 控制的對象

  function scrollTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  el.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTop();
  });

  // --- 鍵盤點擊置頂按鈕
  el.addEventListener('keydown', (e) => {
    e.preventDefault();
    scrollTop();
    // --- window.scrollY 等於零的時候 執行 focus
    window.addEventListener('scroll', focusTopBtn);

    function focusTopBtn() {
      if (window.scrollY === 0) {
        setTimeout(() => {
          document.querySelector('a.goCenter').focus();
          window.removeEventListener('scroll', focusTopBtn);
        }, 500);
      }
    }
  });

  // --- 按鈕出現的函式
  window.addEventListener('scroll', () => {
    const top = window.scrollY;
    if (top > 200) {
      el.style.display = 'block';
      el.style['opacity'] = '1';
      el.style['transition'] = 'all 0.5s';
    } else {
      el.style['opacity'] = '0';
      el.style['transition'] = 'all 0.5s';
      BtnStyleNone();
    }
    // --- 如果 opacity為 0 則 display none
    function BtnStyleNone() {
      setTimeout(() => {
        const btn = document.querySelector('.scrollToTop');
        const btnOpacity = parseInt(btn.style.opacity);
        if (btnOpacity === 0) {
          btn.style.display = 'none';
        }
      }, 200);
    }
  });
}
scrollToTop({
  name: document.querySelector('.scrollToTop'), // --- 監聽的對象
});

// -----------------------------------------------------------------------
// -----  語言模組 dropdwon   ---------------------------------------------
// -----------------------------------------------------------------------

class SelectSlider {
  constructor(obj) {
    this.name = obj.name || null; // --- 按鈕列表名稱
    this.control = obj.control || null; // --- 控制的對象名稱
  }
  // --- 點擊 語言模組
  sliderClick() {
    this.name.forEach((i) => {
      i.addEventListener('click', (e) => {
        e.preventDefault();
        const sliderItem = e.target.nextElementSibling;
        if (sliderItem === null) {
          return;
        } else if (sliderItem.offsetHeight !== 0 || sliderItem.offsetHeight === null) {
          slider.jsSlideUp(sliderItem, 300);
        } else {
          slider.jsSlideDown(sliderItem, 300);
        }
        this.sliderClose(e.target);
      });
    });
  }
  // --- Keydown 語言模組
  sliderKeydown() {
    this.control.forEach((i) => {
      i.addEventListener('keydown', (e) => {
        const sliderItem = e.target.nextElementSibling;
        if (sliderItem) {
          slider.jsSlideDown(sliderItem, 300);
        }
      });
    });
  }
  // --- Focusout 語言模組
  sliderFocusout() {
    this.name.forEach((i) => {
      const nodes = i.querySelectorAll('ul li a');
      const lastNodes = nodes[nodes.length - 1];
      const sliderItem = i.querySelector('ul');
      lastNodes.addEventListener('focusout', (e) => {
        e.preventDefault();
        slider.jsSlideUp(sliderItem, 300);
      });
    });
  }
  // --- 關閉語言模組
  sliderClose(item) {
    const sliderItem = item.nextElementSibling;
    const that = this;

    function clickOtherPlace(e) {
      const chooseClassName = that.name[0].className;
      if (e.target.closest(`.${chooseClassName}`) === null) {
        slider.jsSlideUp(sliderItem, 300);
      } else {
        return;
      }
    }
    document.addEventListener('touchstart', (e) => {
      e.preventDefault();
      clickOtherPlace(e);
    });
    document.addEventListener('click', clickOtherPlace);
  }

  initial() {
    this.sliderClick();
    this.sliderKeydown();
    this.sliderFocusout();
  }
}

const languageSelect = new SelectSlider({
  name: document.querySelectorAll('.language'), // --- 控制的對象
  control: document.querySelectorAll('.language a'), // --- 監聽的對象
});
languageSelect.initial();

// -----------------------------------------------------------------------
// -----  分享按鈕 share dropdwon   ---------------------------------------
// -----------------------------------------------------------------------

function shareBtnFunction() {
  // --- 創造一個a連結的按鈕
  const shareUl = document.querySelector('.share');
  const btn = document.createElement('a');
  if (shareUl) {
    btn.setAttribute('class', 'shareButton');
    btn.setAttribute('role', 'button');
    btn.textContent = 'share分享按鈕';
    shareUl.insertBefore(btn, shareUl.childNodes[0]);
  }
  const shareBtn = new SelectSlider({
    name: document.querySelectorAll('.share'), // --- 控制的對象
    control: document.querySelectorAll('.share a'), // --- 監聽的對象
  });
  shareBtn.initial();
}
shareBtnFunction();

// -----------------------------------------------------------------------
// -----  form表單 單個檔案上傳+多個檔案上傳   --------------------------------
// -----------------------------------------------------------------------

function addFile() {
  const addFileName = document.querySelectorAll('.check_file');
  addFileName.forEach((i) => {
    i.addEventListener('change', pushFileName);
  });

  function pushFileName(e) {
    let _fileLen = e.target.files.length;
    let _fileName = '';
    const uploadInput = e.target.parentNode.closest('.uploadGrp').querySelector('.upload_file');
    if (_fileLen > 1) {
      _fileName = `${_fileLen} files selected`;
    } else {
      _fileName = e.target.files[0].name;
    }
    uploadInput.value = _fileName;
  }
}
addFile();

// -----------------------------------------------------------------------
// -----  checkboxBlur 失去焦點   -----------------------------------------
// -----------------------------------------------------------------------

function checkboxBlur() {
  const checkboxList = document.querySelectorAll('input[type="checkbox"]');
  checkboxList.forEach((i) => {
    i.addEventListener('click', (e) => {
      e.target.blur();
    });
  });
}
checkboxBlur();

// -----------------------------------------------------------------------
// -----  category active    ---------------------------------------------
// -----------------------------------------------------------------------

function categoryActive() {
  const categoryList = document.querySelectorAll('.category');
  categoryList.forEach((i) => {
    const item = i.querySelectorAll('a');
    item.forEach((tag) => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        removeClass(item);
        e.target.classList.add('active');
      });
    });
  });

  function removeClass(item) {
    item.forEach((i) => {
      i.classList.remove('active');
    });
  }
}
categoryActive();

// -----------------------------------------------------------------------
// -----  gotoCenter on focus跳到 content   ------------------------------
// -----------------------------------------------------------------------

function gotoCenter() {
  const goCenterTag = document.querySelector('a.goCenter');
  const acTag = document.querySelector('#aC');
  const mainaccessKey = document.querySelector('.main .accessKey');
  const headerHeight = document.querySelector('.header').offsetHeight;
  // --- .accessKey 到top 的距離等於 header + .accessKey到父層上方的距離
  let _distance = headerHeight + mainaccessKey.offsetTop;
  if (goCenterTag) {
    goCenterTag.addEventListener('keydown', (e) => {
      if (e.which === 13) {
        acTag.focus();
        window.scrollTo({
          top: _distance,
          left: 0,
          behavior: 'smooth',
        });
      }
    });
  }
}
gotoCenter();

// -----------------------------------------------------------------------
// -----  無障礙快捷鍵盤組合 a11yKeyCode   ----------------------------------------------
// -----------------------------------------------------------------------

function a11yKeyCode() {
  let search = document.querySelector('.search input[type="text"]');
  let header = document.querySelector('.header .accessKey');
  let main = document.querySelector('.main .accessKey');
  let footer = document.querySelector('footer .accessKey');
  let distance = 0;

  // --- focus element
  function focusElem(distance, el) {
    if (window.scrollY === distance) {
      el.focus();
    }
  }

  // --- scroll to element position
  function scrollAnime(distance, el) {
    window.scrollTo({
      top: distance,
      behavior: 'smooth',
    });
    window.addEventListener('scroll', () => {
      focusElem(distance, el);
    });
  }

  // --- click a11 button
  document.addEventListener('keydown', (e) => {
    switch (e.altKey && e.code) {
      // alt+S 查詢
      case true && 'KeyS':
        scrollAnime(0, search);
        focusElem(0, search);
        break;
      // --- alt+U header
      case true && 'KeyU':
        scrollAnime(0, header);
        focusElem(0, header);
        break;
      // --- alt+C 主要內容區
      case true && 'KeyC':
        main.focus();
        let _headerHeight = document.querySelector('header').offsetHeight;
        scrollAnime(_headerHeight, main);
        focusElem(_headerHeight, main);
        break;
      // --- alt+Z footer
      case true && 'KeyZ':
        let _bodyScrollHeight = document.documentElement.scrollHeight;
        let _bodyClientHeight = document.documentElement.clientHeight;
        let _distance = _bodyScrollHeight - _bodyClientHeight;
        scrollAnime(_distance, footer);
        focusElem(_distance, footer);
        break;
    }
  });
}
a11yKeyCode();

// -----------------------------------------------------------------------
// -----  無障礙錨點切換語系   ----------------------------------------------
// -----------------------------------------------------------------------
// --- 無障礙錨點切換語系，更改accessKey的title名稱

function switchA11TitleName() {
  const webLang = document.querySelector('html').getAttribute('lang');
  const headerTitle = document.querySelector('.header .accessKey');
  const mainTitle = document.querySelector('.main .accessKey');
  const footerTitle = document.querySelector('footer .accessKey');
  const searchTitle = document.querySelector('.search');
  let _lang = webLang.substring(0, 2);
  if (_lang === 'zh') {
    headerTitle.setAttribute('title', '上方功能區塊');
    mainTitle.setAttribute('title', '中央內容區塊');
    footerTitle.setAttribute('title', '下方功能區塊');
  } else {
    headerTitle.setAttribute('title', 'header');
    mainTitle.setAttribute('title', 'content');
  }
  if (searchTitle !== null) {
    if (_lang === 'zh') {
      searchTitle.setAttribute('title', '關鍵字搜尋：文章關鍵字搜尋');
    } else {
      searchTitle.setAttribute('title', 'footer');
      searchTitle.setAttribute('title', 'search');
    }
  }
  if (footerTitle !== null) {
    footerTitle.setAttribute('title', '下方功能區塊');
  }
}
switchA11TitleName();

// -----------------------------------------------------------------------
// -----   tableList樣式 加上 data-title   -------------------------------
// -----------------------------------------------------------------------

function tableAddDataAttributes(obj) {
  const el = document.querySelectorAll(obj.elemClass);

  function setTrAttr(i) {
    const thList = i.querySelectorAll('th');
    const trList = i.querySelectorAll('tr');
    trList.forEach((trItem) => {
      const tdList = trItem.querySelectorAll('td');
      tdList.forEach((i, idx) => {
        tdList[idx].setAttribute(`data-${obj.dataName}`, `${thList[idx].textContent}`);
      });
    });
  }
  el.forEach((i) => {
    const tableItem = i.querySelectorAll('table');
    tableItem.forEach((i) => {
      setTrAttr(i);
    });
  });
}
// tableAddDataAttributes({
//   elemClass: '.tableList',
//   dataName: 'title',
// }); // tableList樣式 加上 data-title

// -----------------------------------------------------------------------
// -----   scrollTables   ------------------------------------------------
// -----------------------------------------------------------------------

function scrollTables(obj) {
  let el = document.querySelectorAll(obj) || null; // --- 按鈕列表名稱

  // --- 檢查父層有沒有 tableList
  function appendEle() {
    el.forEach((i) => {
      let _appendLeftEle;
      let _appendRightEle;
      let _leftBtn;
      let _rightBtn;
      let _hasItem = i.parentElement.classList.contains('tableList');
      let _hasNavLeft = i.parentElement.querySelector('.scrollTableNavLeft');
      if (!_hasItem && _hasNavLeft === null) {
        _appendLeftEle = document.createElement('div');
        _appendLeftEle.setAttribute('class', 'scrollTableNav scrollTableNavLeft');
        _appendLeftEle.style.height = `${i.parentElement.clientHeight}px`;
        _appendRightEle = document.createElement('div');
        _appendRightEle.setAttribute('class', 'scrollTableNav scrollTableNavRight');
        _appendRightEle.style.height = `${i.parentElement.clientHeight}px`;
        i.parentElement.style.position = 'relative';
        i.parentElement.prepend(_appendLeftEle, _appendRightEle);
        // --- 增加左邊按鈕
        _leftBtn = document.createElement('div');
        _leftBtn.setAttribute('class', 'scrollTableLeftBtn');
        _appendLeftEle.appendChild(_leftBtn);
        // --- 增加右邊按鈕
        _rightBtn = document.createElement('div');
        _rightBtn.setAttribute('class', 'scrollTableRightBtn');
        _appendRightEle.appendChild(_rightBtn);
        displayNoneEle();
      }
    });
  }

  // --- 開關遮罩功能
  function displayNoneEle() {
    el.forEach((i) => {
      let _hasItem = i.parentElement.classList.contains('tableList');
      if (!_hasItem) {
        hiddenEle(i);
      }

      function hiddenEle(el) {
        // --- 父層元素的寬;
        let _table = el.parentElement.clientWidth;
        // --- 子層元素的寬
        let _tableItem = el.scrollWidth;
        // --- 左邊遮罩
        let _rightEle = el.parentElement.querySelector('.scrollTableNavRight');
        // --- 右邊遮罩
        let _leftEle = el.parentElement.querySelector('.scrollTableNavLeft');
        // --- 如果沒有建立遮罩
        if (_rightEle == null) {
          return;
        }
        // --- 如果子層跟父層一樣寬度
        if (_table === _tableItem) {
          _leftEle.style.display = 'none';
          _rightEle.style.display = 'none';
        } else {
          el.parentElement.scrollLeft = '0';
          _rightEle.style.display = 'block';
          _rightEle.style.opacity = '1';
        }
        eleScroll();
      }
    });
  }
  // --- 當父層滾輪滾動
  function eleScroll() {
    el.forEach((i) => {
      i.parentElement.addEventListener('scroll', () => {
        // --- 父層元素的寬
        let _table = i.parentElement.clientWidth;
        // --- 子層元素的寬
        let _tableItem = i.scrollWidth;
        // --- 左邊遮罩
        let _rightEle = i.parentElement.querySelector('.scrollTableNavRight');
        // --- 右邊遮罩
        let _leftEle = i.parentElement.querySelector('.scrollTableNavLeft');
        // --- 捲軸位置
        let _scrollPosition = i.parentElement.scrollLeft;
        _rightEle.style.right = `-${i.parentElement.scrollLeft}px`;
        _leftEle.style.left = `${i.parentElement.scrollLeft}px`;

        if (_scrollPosition === 0) {
          _leftEle.style.opacity = 0;
          _rightEle.style.opacity = 1;
        }
        // --- 如果捲軸位置還沒到底
        if (_scrollPosition > 0) {
          _leftEle.style.opacity = 1;
        }
        // --- 如果捲軸位置＋父層寬度 ＝ 子層寬度
        if (_scrollPosition + _table === _tableItem) {
          _rightEle.style.opacity = 0;
          _leftEle.style.opacity = 1;
          _leftEle.style.display = 'block';
        }
        // --- 如果捲軸位置＋父層寬度 < 子層寬度
        if (_scrollPosition + _table < _tableItem) {
          _rightEle.style.opacity = 1;
        }
      });
    });
  }

  // --- 點擊左右按鈕時滾動畫面
  function clickEleBtn() {
    // --- 點擊左邊按鈕
    const leftBtn = document.querySelectorAll('.scrollTableLeftBtn');
    if (leftBtn.length !== 0) {
      leftBtn.forEach((i) => {
        i.addEventListener('click', (item) => {
          i.parentElement.parentElement.scrollLeft -= 200;
        });
      });
    }
    // --- 點擊右邊按鈕
    const rightBtn = document.querySelectorAll('.scrollTableRightBtn');
    if (rightBtn.length !== 0) {
      rightBtn.forEach((i) => {
        i.addEventListener('click', (item) => {
          i.parentElement.parentElement.scrollLeft += 200;
        });
      });
    }
  }

  appendEle();
  clickEleBtn();
  // --- resize
  window.addEventListener('resize', () => {
    let _hasItem;
    el.forEach((i) => {
      _hasItem = i.parentElement.classList.contains('tableList');
      if (!_hasItem) {
        displayNoneEle();
      }
    });
  });
}
// scrollTables();

// -----------------------------------------------------------------------
// -----   lazy load   ---------------------------------------------------
// -----------------------------------------------------------------------

let lazyLoadInstance = new LazyLoad({
  elements_selector: 'img.lazy',
  placeholder: '/images/basic/placeholder.gif',
  effect: 'fadeIn',
  fadeTime: 600,
  threshold: 0,
});

// -----------------------------------------------------------------------
// -----   Accordion設定   ------------------------------------------------
// -----------------------------------------------------------------------

function accordionSlider(obj) {
  const list = document.querySelectorAll(obj.list);
  let { autoSlider } = obj;
  const { open, close } = obj.info;
  const duration = obj.duration || 300;
  list.forEach((item, index) => {
    let contentA = item.nextElementSibling.querySelectorAll('[href],input,button');
    let contentFirstA = contentA[0];
    item.innerHTML += `<span class="accordionBtn">${open}</span>`;
    item.innerHTML += `<span class="accordionArrow"></span>`;
    item.addEventListener('click', function () {
      toggleAccordion(item);
    });
    //無障礙
    item.addEventListener('keydown', (e) => {
      if (e.which === 9 && !e.shiftKey) {
        if (!item.parentElement.classList.contains('active')) {
          toggleAccordion(item);
        }
      } else if (e.which === 9 && e.shiftKey) {
        if (autoSlider) {
          e.preventDefault();
          toggleAccordion(item);
          if (contentA.length) {
            contentA[contentA.length - 1].focus();
          } else {
            list[index - 1].focus();
          }
        } else {
          toggleAccordion(item);
        }
      }
    });
    if (contentFirstA !== undefined && autoSlider) {
      contentFirstA.addEventListener('keydown', (e) => {
        if (e.which === 9 && e.shiftKey) {
          list[index].focus();
        }
      });
    }
  });

  function toggleAccordion(item) {
    let fun = obj.fun;
    let content = item.parentElement.querySelector('.accordionContent');
    let display = window.getComputedStyle(content).display;
    item.parentElement.classList.add('active');
    content.style.display = display;
    if (display === 'none') {
      display = 'block';
      content.style.display = display;
      fun ? fun(duration) : '';
      let height = content.offsetHeight;
      content.style.height = 0;
      content.offsetHeight;
      content.style.transitionProperty = 'height';
      content.style.transitionDuration = `${duration}ms`;
      content.style.height = height + 'px';
      item.querySelector('.accordionBtn').innerHTML = `${close}`;
      if (autoSlider) {
        const siblings = [...item.parentNode.parentNode.children].filter((child) => {
          return child !== item.parentNode;
        });
        siblings.forEach((v) => {
          v.classList.remove('active');
          let siblingsContent = v.querySelector('.accordionContent');
          siblingsContent.style.height = `${siblingsContent.offsetHeight}px`;
          siblingsContent.style.transitionProperty = 'height';
          siblingsContent.style.transitionDuration = `${duration}ms`;
          siblingsContent.offsetHeight;
          siblingsContent.style.height = 0;
          v.querySelector('.accordionBtn').innerHTML = `${open}`;
          window.setTimeout(() => {
            siblingsContent.style.display = 'none';
            siblingsContent.style.removeProperty('height');
            siblingsContent.style.removeProperty('transition-duration');
            siblingsContent.style.removeProperty('transition-property');
          }, duration);
        });
      }
      setTimeout(() => {
        content.style.removeProperty('height');
        content.style.removeProperty('transition-duration');
        content.style.removeProperty('transition-property');
      }, duration);
    } else {
      content.style.height = `${content.offsetHeight}px`;
      content.style.transitionProperty = 'height';
      content.style.transitionDuration = `${duration}ms`;
      content.offsetHeight;
      content.style.height = 0;
      item.querySelector('.accordionBtn').innerHTML = `${open}`;
      item.parentElement.classList.remove('active');
      setTimeout(() => {
        content.style.display = 'none';
        content.style.removeProperty('height');
        content.style.removeProperty('transition-duration');
        content.style.removeProperty('transition-property');
      }, duration);
    }
  }
}
// accordionSlider({
//   list: '.accordionList', // 問題區塊
//   content: '.accordionContent', // 回答區塊
//   autoSlider: true, // true 點選其他項目時會關閉已開啟的內容，false 需要再點一次才會關閉
//   duration:300, // 展開/縮起時間
//   info: {
//     open: '展開', // 收合時顯示
//     close: '收合', // 展開時顯示
//   },
// });
// -----------------------------------------------------------------------
// -----   swiper 箭頭設定   ------------------------------------------------
// -----------------------------------------------------------------------
function swiperArrows(obj) {
  let nextClass = document.querySelectorAll(obj.next);
  let prevClass = document.querySelectorAll(obj.prev);
  let documentHtml = document.querySelector('html');
  if (documentHtml.getAttribute('lang')) {
    let webLang = documentHtml.getAttribute('lang');
    obj.data.forEach((s) => {
      if (webLang.slice(0, 2) == s.lang) {
        nextClass.forEach((v) => v.setAttribute('title', s.nextText));
        prevClass.forEach((v) => v.setAttribute('title', s.prevText));
      } else {
        nextClass.forEach((v) => v.setAttribute('title', obj.default.nextText));
        prevClass.forEach((v) => v.setAttribute('title', obj.default.prevText));
      }
    });
  }
}
swiperArrows({
  next: '.nextSlider',
  prev: '.prevSlider',
  data: [
    //增加語系請寫在這邊
    {
      lang: 'zh',
      nextText: '下一筆',
      prevText: '上一筆',
    },
  ],
  default: {
    nextText: 'next',
    prevText: 'previous',
  },
});
