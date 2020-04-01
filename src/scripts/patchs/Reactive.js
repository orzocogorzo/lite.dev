module.exports = function Reactive (state, handlers, callback) {
    const self = this;
    const _setters = handlers.setters || new Object();
    const _callbacks = handlers.callbacks || new Object();
    const _getters = handlers.getters || new Object();
    const _callback = callback || function () {};

    return new Proxy(state, {
        set: function (obj, attr, value) {
            var from = obj[attr];
            value = _setters.hasOwnProperty(attr) ? _setters[attr].call(self, value, from) : value;
            if (obj[attr] !== value) {
                obj[attr] = value;
                _callbacks.hasOwnProperty(attr) && _callbacks[attr].call(self, value, from);
                _callback.call(self, attr, value, from);
                self.$dispatch && self.$dispatch("update", {
                    attr: attr,
                    from: from,
                    to: value
                }, self);
                self.$dispatch && self.$dispatch("update:" + attr, {
                    from: from,
                    to: value
                });
            }
        },
        get: function (obj, attr) {
            return _getters.hasOwnProperty(attr) ? _getters[attr].call(self, obj[attr]) : obj[attr];
        }
    });
}