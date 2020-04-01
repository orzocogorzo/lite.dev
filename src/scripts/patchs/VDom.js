const snabbdom = require("snabbdom");
const patch = snabbdom.init([
    require("snabbdom/modules/class").default,
    require("snabbdom/modules/style").default,
    require("snabbdom/modules/props").default,
    require("snabbdom/modules/attributes").default,
    require("snabbdom/modules/dataset").default,
    require("snabbdom/modules/eventlisteners").default
]);
const h = require("snabbdom/h").default;
const toVNode = require("snabbdom/tovnode").default;

module.exports = function VDom (root, data) {
    
    function parseNodeDefn (nodeDefn) {
        var tag, modules = new Object(), childrens = new Array(), text = null;
        if (nodeDefn.length > 0) {
            if (typeof nodeDefn[0] != "string") {
                throw new Error("Bad template format");
            }
            tag = nodeDefn[0];
            if (nodeDefn.length == 2) {
                tag = nodeDefn[0];
                if (typeof nodeDefn[1] == 'object' && nodeDefn[1] instanceof Object && !Array.isArray(nodeDefn[1])) {
                    modules = nodeDefn[1];
                } else if (typeof nodeDefn[1] == 'object' && nodeDefn[1] instanceof Object && Array.isArray(nodeDefn[1])) {
                    childrens =  nodeDefn[1];
                } else if (typeof nodeDefn[1] == 'string') {
                    text = nodeDefn[1];
                } else {
                    throw new Error("Bad template format");
                }
            } else if (nodeDefn.length == 3) {
                if (typeof nodeDefn[1] == 'object' && nodeDefn[1] instanceof Object && !Array.isArray(nodeDefn[1])) {
                    modules = nodeDefn[1];
                    if (typeof nodeDefn[2] == 'object' && nodeDefn[2] instanceof Object && Array.isArray(nodeDefn[2])) {
                        childrens = nodeDefn[2];
                    } else if (typeof nodeDefn[2] == 'string') {
                        text = nodeDefn[2];
                    }
                } else if (typeof nodeDefn[1] == 'object' && nodeDefn[1] instanceof Object && Array.isArray(nodeDefn[1])) {
                    childrens =  nodeDefn[1];
                    if (typeof nodeDefn[1] == 'string') {
                        text = nodeDefn[2];
                    } else {
                        throw new Error("Bad template format");
                    }
                } else {
                    throw new Error("Bad template format");
                }
    
            } else if (nodeDefn.length == 4) {
                if (typeof nodeDefn[1] == 'object' && nodeDefn[1] instanceof Object && !Array.isArray(nodeDefn[1])) {
                    modules = nodeDefn[1];
                } else {
                    throw new Error("Bad template format");
                }
                if (typeof nodeDefn[2] == 'object' && nodeDefn[2] instanceof Object && Array.isArray(nodeDefn[2])) {
                    childrens = nodeDefn[2];
                } else {
                    throw new Error("Bad template format");
                }

                if (typeof nodeDefn[3] == "string") {
                    text = nodeDefn[3];
                } else {
                    throw new Error("Bad template format");
                }
            }
        } else {
            throw new Error("Bad template format");
        } 
        
        return {
            tag: tag, 
            modules: modules,
            childrens: childrens, 
            text: text
        };
    }

    function parse (vDomDefn, data) {
        vDomDefn = vDomDefn || new Array();
        data = data || new Object();
        if (vDomDefn.length === 0) return void(0);

        return vDomDefn.map(nodeDefn => {
            if (!nodeDefn) return null;
            nodeDefn = parseNodeDefn(nodeDefn);
            nodeDefn.modules = Object.keys(nodeDefn.modules).reduce((newModules, moduleName) => {
                module = nodeDefn.modules[moduleName];
                newModules[moduleName] = Object.keys(module).reduce((newModule, key) => {
                    newModule[key] = typeof module[key] === "function" && moduleName !== "on" && module[key].call(data) ||
                        moduleName === "on" && module[key].bind(root) || module[key];
                    return newModule;
                }, new Object());
                return newModules;
            }, new Object());

            nodeDefn.childrens = parse(nodeDefn.childrens);
            if (nodeDefn.childrens) {
                return h(nodeDefn.tag, nodeDefn.modules, nodeDefn.childrens);
            } else {
                return h(nodeDefn.tag, nodeDefn.modules, nodeDefn.text);
            }
        }).filter(d => Boolean(d));
    }

    function VDom (node) {
        const self = this;
        this._el = node.cloneNode();
        this.el = node;
        this.$el = toVNode(this.el);
        this._$el = this.$el;
        var _vDom;

        this.sync = function (template) {
            if (template.length > 1) {
                throw new Error("View template must contain only one root node");
            }
            _vDom = parse(template, self.data);
            return this;
        }

        this.render = function () {
            self.$el = patch(self.$el, _vDom[0]);
            self.el = self.$el.elm;
            return this;
        }

        this.detach = function detach () {
            self.el.innerHTML = "";
            self.$el = toVNode(self.el);
        }

        this.remove = function () {
            // delete _vDom;
            self.detach();
            delete self.$el;
            delete self.el;
            return this;
        }
    }

    if (root instanceof HTMLElement) {
        const vDom = new VDom(root);
        vDom.data = data;
    } else {
        var vDom = new VDom(root.el);
        vDom.data = root.$state;
        root.dom = vDom;
        delete root.el;
        delete root.$el;
        root.dom.$render = vDom.render.bind(root);
        root.dom.$remove = vDom.remove.bind(root);
        root.dom.$sync = vDom.sync.bind(root);
        root.dom.$detach = vDom.detach.bind(root);
        // root.$on && root.$on("update", function onUpdate () {
        //     root.dom.$sync(root.template);
        // });
    }
}