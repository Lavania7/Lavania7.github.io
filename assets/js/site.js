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

  var rtc = document.getElementById('site-rtc');
  if (rtc) {
    function updateRtc() {
      var now = new Date();
      var pad = function (value) { return String(value).padStart(2, '0'); };
      rtc.dateTime = now.toISOString();
      rtc.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(':');
    }
    updateRtc();
    window.setInterval(updateRtc, 1000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) updateRtc(); });
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

  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    var mainContent = document.getElementById('main-content');
    function updateBackToTop() {
      backToTop.hidden = window.scrollY < 160;
      var bottomInset = Math.max(24, window.innerHeight - mainContent.getBoundingClientRect().bottom + 24);
      backToTop.style.bottom = bottomInset + 'px';
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', updateBackToTop);
    updateBackToTop();
  }

  var searchForm = document.querySelector('.site-search');
  if (searchForm) {
    var searchInput = searchForm.querySelector('input');
    var searchResults = document.getElementById('search-results');
    var searchPosts;
    function closeSearch() {
      searchResults.hidden = true;
      searchInput.setAttribute('aria-expanded', 'false');
    }
    function showSearch() {
      var query = searchInput.value.trim().toLocaleLowerCase();
      searchPosts = null;
      searchResults.replaceChildren();
      if (!query) { closeSearch(); return; }
      fetch(searchForm.dataset.searchUrl).then(function (response) {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      }).then(function (posts) {
        if (query !== searchInput.value.trim().toLocaleLowerCase()) return;
        searchPosts = posts.filter(function (post) {
          return [post.title, post.description, post.domain, post.activity].join(' ').toLocaleLowerCase().includes(query);
        }).slice(0, 8);
        searchResults.replaceChildren();
        if (searchPosts.length) {
          searchPosts.forEach(function (post) {
            var link = document.createElement('a');
            link.href = post.url;
            link.textContent = post.title;
            searchResults.appendChild(link);
          });
        } else {
          var empty = document.createElement('p');
          empty.textContent = '没有找到相关文章。';
          searchResults.appendChild(empty);
        }
        searchResults.hidden = false;
        searchInput.setAttribute('aria-expanded', 'true');
      }).catch(function () {
        searchResults.replaceChildren();
        var error = document.createElement('p');
        error.textContent = '搜索暂时不可用。';
        searchResults.appendChild(error);
        searchResults.hidden = false;
      });
    }
    searchInput.addEventListener('input', showSearch);
    searchInput.addEventListener('focus', function () { if (searchInput.value.trim()) showSearch(); });
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (searchPosts && searchPosts.length) window.location.href = searchPosts[0].url;
      else showSearch();
    });
    document.addEventListener('click', function (event) { if (!searchForm.contains(event.target)) closeSearch(); });
    searchForm.addEventListener('keydown', function (event) { if (event.key === 'Escape') { closeSearch(); searchInput.blur(); } });
  }

  var cards = Array.from(document.querySelectorAll('.article-card[data-domain]'));
  if (cards.length) {
    var filterEmpty = document.querySelector('.filter-empty');
    var sectionTitle = document.getElementById('recent-posts');
    var pagination = document.getElementById('posts-pagination');
    var pageSize = 3;

    function changePage(page) {
      var url = new URL(window.location.href);
      if (page === 1) url.searchParams.delete('page');
      else url.searchParams.set('page', String(page));
      window.history.pushState(null, '', url);
      renderPosts();
      sectionTitle.scrollIntoView({ block: 'start' });
    }

    function renderPosts() {
      var params = new URLSearchParams(window.location.search);
      var domain = params.get('domain');
      var activity = params.get('activity');
      var matching = cards.filter(function (card) {
        return (!domain || card.dataset.domain === domain) &&
          (!activity || card.dataset.activity.split(' ').includes(activity));
      });
      var totalPages = Math.ceil(matching.length / pageSize);
      var requestedPage = Number(params.get('page'));
      var currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, totalPages || 1) : 1;
      cards.forEach(function (card) { card.hidden = true; });
      matching.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(function (card) { card.hidden = false; });
      if (filterEmpty) filterEmpty.hidden = matching.length !== 0;
      if (sectionTitle) sectionTitle.textContent = domain ?
        domain.charAt(0).toUpperCase() + domain.slice(1) + (activity ? ' · ' + activity.replace(/(^|-)(\w)/g, function (_, separator, char) { return separator === '-' ? ' ' + char.toUpperCase() : char.toUpperCase(); }) : '') : 'Latest';

      pagination.replaceChildren();
      pagination.hidden = totalPages <= 1;
      if (pagination.hidden) return;

      function addButton(label, page, description, disabled, active) {
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.setAttribute('aria-label', description);
        button.disabled = disabled;
        if (active) button.setAttribute('aria-current', 'page');
        if (!disabled && !active) button.addEventListener('click', function () { changePage(page); });
        pagination.appendChild(button);
      }

      addButton('<<', 1, '第一页', currentPage === 1, false);
      addButton('<', currentPage - 1, '上一页', currentPage === 1, false);
      var numbers = new Set([1, totalPages]);
      for (var page = Math.max(1, currentPage - 1); page <= Math.min(totalPages, currentPage + 1); page++) numbers.add(page);
      if (currentPage <= 2) { numbers.add(2); numbers.add(Math.min(3, totalPages)); }
      if (currentPage >= totalPages - 1) { numbers.add(Math.max(1, totalPages - 2)); numbers.add(Math.max(1, totalPages - 1)); }
      var previous = 0;
      Array.from(numbers).sort(function (a, b) { return a - b; }).forEach(function (page) {
        if (page > previous + 1) {
          var ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.textContent = '...';
          ellipsis.setAttribute('aria-hidden', 'true');
          pagination.appendChild(ellipsis);
        }
        addButton(String(page), page, '第 ' + page + ' 页', false, page === currentPage);
        previous = page;
      });
      addButton('>', currentPage + 1, '下一页', currentPage === totalPages, false);
      addButton('>>', totalPages, '最后一页', currentPage === totalPages, false);
    }

    window.addEventListener('popstate', renderPosts);
    renderPosts();
  }

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
    empty.textContent = '当前页面暂无目录。';
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
