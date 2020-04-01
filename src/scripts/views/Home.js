const BaseView = require('../base/BaseView.js');

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
                            flex: true
                        }
                    },
                    [
                        // NODES
                        [
                            // NODE
                            "h1",
                            "DevLite.js boilerplate"
                        ]
                    ]
                ]
            ];
        }
    });

    return Home;

})();