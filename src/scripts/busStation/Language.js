const BaseView = require("../base/BaseView.js");
const BaseWagon = require("../base/BaseWagon.js");

const Language = (function () {
    function Language (/*{}::initState*/) {
        BaseWagon.call(this, {
            dictionary: new Object()
        });
        this.name = "language";
        this.url = "language.json";
        BaseView.prototype.$lng = this.translate.bind(this);
    }

    Language.prototype = Object.create(BaseWagon.prototype);

    Language.prototype.setDictionary = function setDictionary (dictionary) {
        return dictionary;
    }

    Language.prototype.onDictionary = function onDictionary (dictionary) {
        console.log("new dictionary", dictionary);
    }

    Language.prototype.translate = function (key) {
        return this.dictionary[key] || key;
    }

    BaseWagon.prototype.onFeeds = function onFeeds (res) {
        return new Promise((resolve, reject) => {
            res.json().then(data => {
                this.dictionary = data;
                resolve(data);
            }).catch(err => reject(err));
        });
    }
    
    BaseWagon.prototype.onUpdate = function onUpdate (change) {
        // TO OVERWRITE
        console.log("change:dictionary", change);
        location.reload();
        // console.log("update:"+this.name, change);
    }

    return Language;
})();

module.exports = Language;