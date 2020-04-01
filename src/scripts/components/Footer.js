const BaseView = require('../base/BaseView.js');

module.exports = (function () {

    const Footer = BaseView.extend(function Footer () {
        const self = this;

        this.template = function () {
            return [
                [
                    "div#footer",
                    "Footer"
                ]
            ]
        }
    });

    return Footer;
})();