// VENDOR

// MODULES
const startApp = require('./index.js');
window.environment = require('../environment.js')[process.env.NODE_ENV === "production" ? "pro" : "dev"];

if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", startApp, false);
} else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", startApp);
} else {
    window.onload = startApp;
}
