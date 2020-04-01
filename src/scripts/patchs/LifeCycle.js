const Dispatcher = require("./Dispatcher.js");

module.exports = function LifeCycle (root) {

    function _beforeRender () {
        this.$dispatch("before:render", null, this);
    };

    function _render (sourcefn) {
        sourcefn.call(this);
        this.$dispatch("render", null, this);
    };

    function _afterRender () {
        this.$dispatch("after:render", null, this);
    };

    let render_sourcefn = root.$render;
    root.$render = function render () {
        _beforeRender.call(root);
        _render.call(root, render_sourcefn);
        _afterRender.bind(root);
        return root;
    };

    function _beforeDetach () {
        this.$dispatch("before:detach", null, this);
    };

    function _detach (sourcfn) {
        sourcfn.call(this);
        this.$dispatch("detach", null, this);
    };

    function _afterDetach () {
        this.$dispatch("after:detach", null, this);
    };

    let detach_sourcefn = root.$detach;
    root.$detach = function detach () {
        _beforeDetach.call(root);
        _detach.call(root, detach_sourcefn);
        _afterDetach.call(root);
        return root;
    };

    function _beforeRemove () {
        this.$dispatch("before:remove", null, this);
    };

    function _remove (sourcefn) {
        sourcefn.call(this);
        this.$dispatch("remove", null, this);
        return root;
    };

    function _afterRemove () {
        this.$dispatch("after:remove", null, this);
    };

    let remove_sourcefn = root.$remove;
    root.$remove = function remove () {
        _beforeRemove.call(root);
        _remove.call(root, remove_sourcefn);
        _afterRemove.call(root);
        return root;
    }

    if (typeof root.$dispatch !== "function") {
        new Dispatcher(root);
    }
};