const BaseView = require("../base/BaseView.js");
const BaseBus = require("../base/BaseBus.js");
const Dispatcher = require("../patchs/Dispatcher.js");


module.exports = (function() {

    // private code block
    var _el,
        _router;
    
    const _state = {
        current: null,
        default: null,
        breadcrumb: new Array()
    };
    const _routes = new Array();

    const RouterView = BaseView.extend(function RouterView (el, state, parent) {
        this.template = [
            [
                "div#router", {
                    class: {flex: true, col: true}
                }, [
                    [
                        "div.router__content", {
                            class: {flex: true, col: true}
                        }, [
                            ["div"]
                        ]
                    ]
                ]
            ]
        ];
    });

    function _hashParser (hash, route) {
        const self = this;

        const newPath = route.rex.exec(hash).slice(1).map(d => d).reduce((a,val,i) => {
            // self.path[route.params[i]] = val;
            a[route.params[i]] = val;
            return a;
        }, new Object());
        Object.keys(this.path).map(k => {
            newPath[k] = newPath[k];
        });
        Object.keys(newPath).map(k => {
            this.path[k] = newPath[k]
            this.path[k] === undefined && delete this.path[k];
        });
    }

    function _queryParser (query) {
        const self = this;
        const newQuery = query.split("&").reduce((a, param) => {
            a[param.split("=")[0]] = param.split("=")[1];
            return a;
        }, new Object());
        Object.keys(this.query).map(k => {
            newQuery[k] = newQuery[k];
        });
        Object.keys(newQuery).map(k => {
            self.query[k] = newQuery[k];
            newQuery[k] === undefined && delete newQuery[k];
        });
    }

    function _initRoutes (routes) {
        Object.keys(routes).map(k => {
            let pathParams = k.split("/:");
            let path = pathParams.splice(0, 1);

            for (let idx in pathParams) {
                pathParams[idx] = "/(.+)";
            };

            let route = new RegExp(["^"].concat(path).concat(pathParams).concat(["$"]).join(""));

            _routes.push({
                tmplt: k,
                params: (k.match(/\:([^\/]+)/g) || []).map(m => m.replace(/\:/, '')),
                rex: route,
                fn: _routesMiddleware.call(this, routes[k].component),
                name: routes[k].name
            });
        });
    };

    function _matchRoute (path) {
        const _hash = (path.split("#")[1] || "").split("?")[0] || ""; // path.replace(/^\#/, '');
        const _query = location.href.split("?")[1] || "";

        let route = _routes.find(r => {
            return r.rex.exec(_hash);
        });

        if (route) {
            var changed = (((_state.current || {path: ""}).path.split("#")[1] || "").split("?")[0] || "") != _hash;
            _beforeNavigate.call(this, _hash, _query, route);
            if (changed) {
                route.fn(routerView.dom.el.children[0].children[0], this.path, this.query);
            }
            this.$dispatch("navigate", {
                path: _hash,
                params: this.path,
                query: this.query
            });
        } else {
            this.redirectToDefault();
        }
    }

    function _beforeNavigate (path, query, route) {
        _state.breadcrumb.push(_state.current);
        _state.current = window.history.state || {
            path: '#' + path + '?' + query,
            from: _state.current,
            tracked: true
        };
        _hashParser.call(this, path, route);
        _queryParser.call(this, query);
    }

    function _routesMiddleware (View) {
        const self = this;
        return function (el, hashParams, queryParams) {
            if (self.view) {
                if (View.prototype.isPrototypeOf(self.view)) {
                    self.view.$state.hashParams = hashParams;
                    self.view.$state.queryParams = queryParams;
                    self.view.$dispatch("update", null, self.view);
                    return self.view;
                }
            }
            self.view = new View(el, {
                hashParams: hashParams,
                queryParams: queryParams
            }, routerView);
            last = self.view;
            self.view.$render();
            return self.view;
        }
    }

    function _start (defaultRoute) {
        const self = this;
        window.onpopstate = function (state) {
            _matchRoute.call(self, location.href);
        };

        // this.navigate(location.hash || defaultRoute || "", null, true);
        const hash = location.hash.replace(/^\#/, '');
        location.hash = location.hash || defaultRoute || "";
        if (hash) {
            window.dispatchEvent(new Event("popstate"));
        }
    };

    function _stop () {
        window.onpopstate = void(0);
    };

    function Router (routes, defaultQuery={}) {
        if (_router) {
            throw new Error("A router is already instantiated");
        } else {
            _router = this;
        }

        const self = this;
        BaseView.prototype.$router = this;
        BaseBus.prototype.$router = this;
        app.$router = this;
        routes["(?![\s\S])"] = routes[""] || this.redirectToDefault;
        delete routes[""];
        
        _initRoutes.call(this, routes);
        this.view = undefined;

        new Dispatcher(this);

        this.query = new Proxy(defaultQuery, {
            set: function (obj, key, val) {
                if (obj[key] !== val) {
                    const from = obj[key];
                    obj[key] = val;
                    self.$dispatch("change:query", {
                        attr: key,
                        val: val,
                        from: from
                    });
                }
            }
        });

        this.$on("change:query", function (change) {
            const currentState = self.getCurrentState();
            const queryParams = Object.keys(self.query).reduce((a,k,i) => {
                return self.query[k] ? (i ? "&" : "?") + a + k + "=" + self.query[k] : a;
            }, '');
            self.navigate(currentState.path.split('?')[0] + queryParams, currentState, true);
        });

        this.path = new Proxy({}, {
            set: function (obj, key, val) {
                if (obj[key] !== val) {
                    const from = obj[key];
                    obj[key] = val;
                    self.$dispatch("change:path", {
                        attr: key,
                        val: val,
                        from: from
                    });
                }
            }
        });
    }

    Router.prototype.start = function (el, defaultRoute) {
        _el = el;
        _state.default = defaultRoute;
        routerView = new RouterView(_el, _state);
        routerView.$render();
        _start.call(this, defaultRoute);
    };

    Router.prototype.stop = function () {
        _stop.call(this);
    };

    Router.prototype.remove = function () {
        routerView.el.parentNode.removeChild(routerView.el);
        this.stop();
        // delete _el.router;
    };

    Router.prototype.redirectToDefault = function (state, silent) {
        this.navigate(_state.default || "", state, silent);
    };

    Router.prototype.navigate = function (path, state, silent) {
        path = path[0] === '#' && path || '#'+path;
        state = state || new Object();
        silent = silent === true;
        this.$dispatch("before:navigate", {
            path: path,
            state: state,
            silent: silent
        });

        const to = {
            from: _state.current,
            path: path,
            tracked: !silent,
            ...state
        }

        if (silent) {
            window.history.replaceState(to, null, path);
        } else {
            window.history.pushState(to, null, path);
            window.dispatchEvent(new Event("popstate"));
        }
    }

    Router.prototype.back = function back () {
        _state.current = _state.breadcrumb.pop();
        if (_state.current) {
            history.back();
        }
    }

    Router.prototype.getCurrentState = function () {
        const state = _state.current;
        if (!state) {
            return {
                from: null,
                path: location.hash.replace(/^\#/, ''),
                tracked: false
            }
        } else {
            return state;
        }
    }

    return Router;

})();
