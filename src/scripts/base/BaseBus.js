const Dispatcher = require("../patchs/Dispatcher.js");
const Reactive = require("../patchs/Reactive.js");
const Fetch = require("../patchs/Fetch.js");
const BaseView = require("../base/BaseView.js");
const { capitalize } = require("../helpers/index.js")

module.exports = (function () {

    let _bus;

    function BaseBus (state, wagons) {
        if (_bus) {
            throw new Error("A bus is already instantiated");
        } else {
            _bus = this;
        }

        const self = this;
        
        new Dispatcher(this);
        new Fetch(this);
        state = state || new Object();

        if (this.$router) {
            state.urlParams = this.$router.path;
            state.hashParams = this.$router.query;
            this.$router.$on("change:path", function () {
                self.$dispatch("update:urlParams", self.urlParams); 
            });
            this.$router.$on("change:query", function () {
                self.$dispatch("update:hashParams", self.hashParams);
            });
        } else {
            delete this.onNavigate;
        }

        const myProps = Object.getOwnPropertyNames(this.__proto__);
        const handlers = Object.keys(state).reduce((acum, attr) => {
            if (myProps.indexOf('on'+capitalize(attr)) >= 0) {
                acum.callbacks[attr] = self.__proto__['on'+capitalize(attr)];
                delete self[attr];
            }
            if (myProps.indexOf('set'+capitalize(attr)) >= 0) {
                acum.setters[attr] = self.__proto__['set'+capitalize(attr)];
                delete self[attr];
            }
            if (myProps.indexOf('get'+capitalize(attr)) >= 0) {
                acum.getters[attr] = self.__proto__['get'+capitalize(attr)];
                delete self[attr];
            }
            return acum;
        }, {
            callbacks: {},
            setters: {},
            getters: {}
        });
        
        reactive = Reactive.call(this, state, handlers, this.onUpdate);
        
        Object.keys(state).map(function (key) {
            Object.defineProperty(self, key, {
                set: function (val) {
                    reactive[key] = val;
                },
                get: function () {
                    return reactive[key];
                } 
            });
        });

        this.$wagons = new Array();
        for (let wagon of wagons) {
            this.addWagon(wagon);
        }

        BaseView.prototype.$bus = this;
    };

    BaseBus.prototype.onUpdate = function onUpdate (attr, to, from) {
        this.$dispatch("updated", {attr: attr, to: to, from: from});
    }

    BaseBus.prototype.preload = function preload () {
        return Promise.all(this.$wagons.filter(wagon => wagon.preload).map(wagon => wagon.feed()));
    }

    BaseBus.prototype.addWagon = function addWagon (Wagon, data) {
        const wagon = new Wagon(data);
        new Dispatcher(wagon);
        new Fetch(wagon);
        const props = Object.getOwnPropertyNames(wagon.__proto__);
        const handlers = Object.keys(wagon.initState).reduce((acum, attr) => {
            if (props.indexOf('on'+capitalize(attr)) >= 0) {
                acum.callbacks[attr] = wagon.__proto__['on'+capitalize(attr)].bind(wagon);
                delete wagon[attr];
            }
            if (props.indexOf('set'+capitalize(attr)) >= 0) {
                acum.setters[attr] = wagon.__proto__['set'+capitalize(attr)].bind(wagon);
                delete wagon[attr];
            }
            if (props.indexOf('get'+capitalize(attr)) >= 0) {
                acum.getters[attr] = wagon.__proto__['get'+capitalize(attr)].bind(wagon);
                delete wagon[attr];
            }
            return acum;
        }, {
            callbacks: {},
            setters: {},
            getters: {}
        });

        reactive = Reactive.call(this, wagon.initState, handlers, this.onWagonUpdate);

        Object.keys(wagon.initState).map(function (key) {
            Object.defineProperty(wagon, key, {
                set: function (val) {
                    reactive[key] = val;
                },
                get: function () {
                    return reactive[key];
                } 
            });
        });
        delete wagon.initState;

        this.$wagons.push(wagon);
    }

    BaseBus.prototype.onWagonUpdate = function onWagonUpdate (wagon, change) {
        this.$dispatch(`update:${wagon}`, change);
        this.$dispatch(`update:data`, wagon, change)
    }

    return BaseBus;
})();