(function () {
  'use strict';
  var root = document.documentElement;
  var themeButton = document.getElementById('theme-toggle');
  var themes = ['system', 'light', 'dark'];
  var themeNames = { system: '跟随系统', light: '纯白', dark: '纯黑' };
  function describeTheme(announce) {
    var theme = root.dataset.theme;
    var next = themes[(themes.indexOf(theme) + 1) % themes.length];
    themeButton.setAttribute('aria-label', '当前主题：' + themeNames[theme] + '。点击切换为' + themeNames[next]);
    themeButton.title = themeNames[theme] + ' · 点击切换为' + themeNames[next];
    if (announce) document.getElementById('theme-status').textContent = '已切换为' + themeNames[theme];
  }
  if (themeButton) {
    describeTheme(false);
    themeButton.addEventListener('click', function () {
      root.dataset.theme = themes[(themes.indexOf(root.dataset.theme) + 1) % themes.length];
      try { localStorage.setItem('iris-theme', root.dataset.theme); } catch (_) { /* Keep the current session usable. */ }
      describeTheme(true);
    });
    window.addEventListener('storage', function (event) {
      if (event.key !== 'iris-theme') return;
      root.dataset.theme = themes.indexOf(event.newValue) !== -1 ? event.newValue : 'system';
      describeTheme(false);
    });
  }

  // Native details support touch and keyboard navigation; hover opens them on a mouse.
  var menus = Array.from(document.querySelectorAll('.topic-menu'));
  function closeMenus(except) {
    menus.forEach(function (menu) { if (menu !== except) menu.open = false; });
  }
  menus.forEach(function (menu) {
    var closeTimer;
    menu.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(closeTimer);
      closeMenus(menu);
      menu.open = true;
    });
    menu.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      closeTimer = setTimeout(function () {
        if (!menu.contains(document.activeElement)) menu.open = false;
      }, 140);
    });
    menu.addEventListener('toggle', function () { if (menu.open) closeMenus(menu); });
    menu.addEventListener('focusout', function (event) {
      if (!menu.contains(event.relatedTarget)) menu.open = false;
    });
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.topic-menu')) closeMenus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var menu = menus.find(function (item) { return item.open; });
    if (menu) { menu.querySelector('summary').focus(); closeMenus(); }
  });

  var mobileQuery = window.matchMedia('(max-width: 1100px)');
  var panels = document.querySelectorAll('[data-responsive-panel]');
  function adaptPanels() {
    panels.forEach(function (panel) { panel.open = !mobileQuery.matches; });
    closeMenus();
  }
  adaptPanels();
  mobileQuery.addEventListener('change', adaptPanels);

  var source = document.querySelector('[data-toc-source]');
  var toc = document.getElementById('post-toc');
  if (!source || !toc) return;
  var headings = Array.from(source.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  var list = document.createElement('ol');
  var links = [];
  var baseLevel = headings.reduce(function (level, heading) {
    return Math.min(level, Number(heading.tagName.slice(1)));
  }, 6);
  headings.forEach(function (heading, index) {
    if (!heading.id) {
      var baseId = 'section-' + (index + 1);
      var uniqueId = baseId;
      var suffix = 1;
      while (document.getElementById(uniqueId)) uniqueId = baseId + '-' + suffix++;
      heading.id = uniqueId;
    }
    var item = document.createElement('li');
    var link = document.createElement('a');
    link.href = '#' + encodeURIComponent(heading.id);
    link.textContent = heading.textContent;
    item.style.setProperty('--toc-depth', Number(heading.tagName.slice(1)) - baseLevel);
    item.appendChild(link);
    list.appendChild(item);
    links.push(link);
    link.addEventListener('click', function () {
      links.forEach(function (other) { other.removeAttribute('aria-current'); });
      link.setAttribute('aria-current', 'location');
      if (mobileQuery.matches) toc.closest('details').open = false;
    });
  });
  toc.replaceChildren();
  if (headings.length) {
    toc.appendChild(list);
    function updateActiveHeading() {
      var boundary = document.querySelector('.site-masthead').getBoundingClientRect().bottom + 36;
      var active = 0;
      headings.forEach(function (heading, index) {
        if (heading.getBoundingClientRect().top <= boundary) active = index;
      });
      links.forEach(function (link, index) {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    var scheduled = false;
    window.addEventListener('scroll', function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () { updateActiveHeading(); scheduled = false; });
    }, { passive: true });
    window.addEventListener('resize', updateActiveHeading);
    updateActiveHeading();
  } else {
    var empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = '本文暂无章节标题。';
    toc.appendChild(empty);
  }
  var readingTime = document.getElementById('reading-time');
  if (readingTime) {
    var text = source.textContent;
    var chineseCharacters = (text.match(/[\u3400-\u9fff]/g) || []).length;
    var words = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/\S+/g) || []).length;
    readingTime.textContent = '约 ' + Math.max(1, Math.ceil(chineseCharacters / 400 + words / 200)) + ' 分钟';
  }
}());
