(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function startApp () {
    document.getElementById("app").innerHTML = `<h1
        style="text-align: center; font-size: 2.5rem; margin-top: 50px;"
    >Hello World from devLite</h1>`;
}
},{}],2:[function(require,module,exports){
// VENDOR

// MODULES
const startApp = require('./app.js');


if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", startApp, false);
} else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", startApp);
} else {
    window.onload = startApp;
}

},{"./app.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi5kZXZsaXRlL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RhcnRBcHAgKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpLmlubmVySFRNTCA9IGA8aDFcbiAgICAgICAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMi41cmVtOyBtYXJnaW4tdG9wOiA1MHB4O1wiXG4gICAgPkhlbGxvIFdvcmxkIGZyb20gZGV2TGl0ZTwvaDE+YDtcbn0iLCIvLyBWRU5ET1JcblxuLy8gTU9EVUxFU1xuY29uc3Qgc3RhcnRBcHAgPSByZXF1aXJlKCcuL2FwcC5qcycpO1xuXG5cbmlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgc3RhcnRBcHAsIGZhbHNlKTtcbn0gZWxzZSBpZiAoZG9jdW1lbnQuYXR0YWNoRXZlbnQpIHtcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLCBzdGFydEFwcCk7XG59IGVsc2Uge1xuICAgIHdpbmRvdy5vbmxvYWQgPSBzdGFydEFwcDtcbn1cbiJdfQ==
