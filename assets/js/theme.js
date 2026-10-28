(function () {
  'use strict';
  var theme = 'system';
  try {
    var saved = localStorage.getItem('iris-theme');
    if (['light', 'dark', 'system'].indexOf(saved) !== -1) theme = saved;
  } catch (_) { /* System theme also works when storage is unavailable. */ }
  document.documentElement.dataset.theme = theme;
}());
