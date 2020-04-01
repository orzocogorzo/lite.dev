const BaseBus = require("../base/BaseBus.js");

module.exports = (function () {

    function DataBus (state, wagons) {
        const self = this;
        BaseBus.call(this, {
            currentSection: "home",
            language: new Object(),
            ...state
        }, wagons);


        this.$on("update:urlParams", function (urlParams) {
            // CALLBACK WHEN URL HAS CHANGED
        });

        this.$on("update:hashParams", function (hashParams) {
            // CALLBACK WHEN URL QUERY HAS CHANGED
        });
    }

    DataBus.prototype = Object.create(BaseBus.prototype);

    DataBus.prototype.onUpdate = function onUpdate (attr, to, from) {
        // console.log(attr, to, from);
    }

    return DataBus;

})();