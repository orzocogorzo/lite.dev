const BaseView = require('../base/BaseView.js');

module.exports = (function () {

    const Header = BaseView.extend(function Header () {
        const self = this;

        this.template = function () {
            return [
                // NODES
                [
                    // NODE
                    "div#header", [
                        // NODES
                        [
                            // NODE
                            "div", {
                                class: {
                                    "header__col": true,
                                    "header__col-left": true,
                                    "flex": true
                                }
                            },
                            self.$lng("app-name")
                        ],
                        [
                            // NODE
                            "div", {
                                class: {
                                    "header__col": true,
                                    "header__col-right": true,
                                    "flex": true
                                }
                            },
                            // NODES
                            Object.keys(self.$state.routes).map((route, i) => {
                                // NODE
                                return [
                                    // NODE
                                    "div", {
                                        class: {
                                            "header__section": true,
                                            "active": self.$state.routes[route].name == self.$bus.currentSection
                                        },
                                        on: {
                                            click: function () {
                                                self.$router.navigate(route);
                                            }
                                        }
                                    },
                                    self.$lng(route.name)
                                ];
                            })
                        ]
                    ]
                ]
            ];
        }
    });
    return Header;
})();
