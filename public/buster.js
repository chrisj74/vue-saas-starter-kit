/* Prevent frame busting */
console.log('name=', window.name);
if (window.name.indexOf('workalongoIframe') !== -1) {
  var el = document.createElement("script");
  el.textContent = "if (top !== self) {window.self = window.top;}";
  document.documentElement.appendChild(el);
}
