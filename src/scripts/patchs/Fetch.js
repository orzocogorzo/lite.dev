const Loader = require('../components/Loader.js');

module.exports = (function () {

    const loader = new Loader();

    function Fetch (root) {
        if (root) {
            root.$fetch = this.request.bind(this);
            return root;
        } else {
            return this.request.bind(this);
        }
    }

    Fetch.prototype.isURL = function validURL(str) {
        
        var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3})|'+ // OR ip (v4) address
        '(localhost))'+ // OR localhost
        '(\\:\\d+)?'+ // port?
        '(\\/[-a-z\\d%_.~+]*)*'+ // path?
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query?
        '(\\#[-a-z\\d_]*)?$','i'); // hash?
        return !!pattern.test(str);
    }

    Fetch.prototype.url = function (url) {
        if (!this.isURL(url)) {
            if (!this.isURL(environment.apiURL + url)) {
                throw new Error("Invalid URL format");
            } else {
                return new URL(environment.apiURL + url);
            }
        } else {
            return new URL(url);
        }
    }

    Fetch.prototype.queryParams = function queryParams (dict, url) {
        url.search = new URLSearchParams(dict);
        return url;
    }

    Fetch.prototype.request = function request (url, options) {
        const self = this;
        options = options || new Object();

        url = this.url(url);
        if (options.queryParams) url = this.queryParams(options.queryParams, url);
        
        const ajax = fetch(url, {
            cors: options.cors || environment.name === "development" ? "cors" : "no-cors", // same-origin
            cache: options.cache || environment.name === "development" ? "no-cache" : "default", // reload, force-cache, only-if-cached
            credentials: options.credentials || "omit", // include, same-origin
            redirect: options.redirect || "follow", // manual, error
            referrer: options.referrer || "no-referrer", // *client
            method: options.method ? options.method.toUpperCase() : "GET", // POST, PUT, DELETE, OPTIONS
            headers: options.headers || {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: options.body || void(0)
        });

        if (options.loader) {
            loader.show();
            ajax.then(res => {
                loader.hide();
                return res;
            }).catch(err => {
                loader.hide();
                return err;
            });
        }

        return ajax;
    }

    return Fetch;

})();