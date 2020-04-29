const BaseView = require('../base/BaseView.js');
const { lazyLoad } = require("../helpers/index.js");

module.exports = (function () {
    const Home = BaseView.extend(function Home (el, state, parent) {
        const self = this;
        
        this.template = function template () {
            return [
                // nodes
                [
                    // node
                    "div#home", {
                        class: {
                            flex: true,
                            col: true
                        }
                    },
                    // NODES
                    ["section1", "section2", "section3"].map(section => {
                        return [
                            "div#"+section, {
                                class: {
                                    "home__section": true
                                }
                            }, [
                                [
                                    "img#"+section, {
                                        attrs: {
                                            "src": `${environment.staticURL}images/${section}-lazy.jpg`,
                                            "data-lazysrc": `${environment.staticURL}images/${section}.jpg`
                                        }
                                    }
                                ],
                                [
                                    "h1",
                                    section
                                ]
                            ]
                        ]
                    })
                ]
            ];
        }
    });

    Home.prototype.onRender = function onRender () {
        lazyLoad(Array.apply(null, document.getElementsByClassName("home__section")).map(section => section.children[0]));
    }

    return Home;

})();