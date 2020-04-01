const Reactive = require('../patchs/Reactive.js');
const Dipsatcher = require('../patchs/Dispatcher.js');
const LifeCycle = require('../patchs/LifeCycle.js');
const VDom = require('../patchs/VDom.js');
const Fetch = require("../patchs/Fetch.js");

module.exports = (function () {

    function capitalize (prop) {
        return prop[0].toUpperCase() + prop.slice(1);
    }

    // PUBLIC CODEBLOCK
    function BaseView (el, state, parent) {
        const self = this;
        // this.initialized = true;

        // MY NODE
        this.el = el;

        // MY STATE
        state = state || new Object();
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
        
        this.$state = Reactive.call(this, state, handlers, function () {
            self.updated = true;
        });

        // DISPATCHER
        new Dipsatcher(this);

        // MY GRAPHIC STRUCTURE
        new VDom(this, this.$state);
        (function () {
            var _template = [
                [
                    'div#view'
                ]
            ];
            Object.defineProperty(self, 'template', {
                get: function () {
                    return typeof _template === "function" && _template() || _template;
                },
                set: function (val) {
                    _template = val;
                }
            });
        })();

        // DEFAULT LIFE CYLCE
        // this.$render = function $render () {
        //     if (self.initialized) {
        //         self.dom.$sync(self.template);
        //         self.initialized = false;
        //     }
        //     this.dom.$render();
        // }

        this.$render = function $render () {
            self.dom.$sync(self.template);
            self.dom.$render();
            return self;
        }

        this.$on("update", this.$render);

        this.$remove = function $remove () {
            self.dom.$remove();
            return self;
        }

        this.$detach = function $detach () {
            self.dom.$detach();
            return self;
        }

        new LifeCycle(this);

        // FAMILY RECONCILIATION
        this.childrens = new Array();
        if (parent) {
            this.parent = parent;
            parent.childrens.push(this);
            // parent.$on("render", this.$render);
            parent.$on("remove", this.$remove);
            parent.$on("detach", this.$detach);
        }

        // TASKS
        this.$on("update", this.onUpdate);
        this.$on("render", this.onRender);
        this.$on("remove", this.onRemove);
        this.$on("detach", this.onDetach);

        // HTTP
        new Fetch(this);

        this.$dispatch("initialze");
    }

    BaseView.prototype.onUpdate = function onUpdate () {
        // console.log(this, 'onUpdate');
    }

    BaseView.prototype.onRender = function onRender () {
        // console.log(this, 'onRender');
    }

    BaseView.prototype.onDetach = function onDetach () {
        // console.log(this, 'ondetach');
    }

    BaseView.prototype.onRemove = function onRemove () {
        // console.log(this, 'onRemove');
    }

    BaseView.prototype.extend = function extend (RefView, defaultState={}) {
        const View = function (el, state={}, parent=null) {
            state = Object.keys(defaultState).reduce((a,k) => {
                a[k] = a[k] || defaultState[k];
                return a;
            }, state);
            BaseView.call(this, el, state, parent);
            RefView.call(this, el, state, parent);
        }

        RefView.prototype = Object.create(BaseView.prototype);
        View.prototype = RefView.prototype;
        View.extend = BaseView.prototype.extend;
        return View;
    }

    BaseView.extend = BaseView.prototype.extend;

    return BaseView;
})();