// INHERITANCE
const BaseView = require("./base/BaseView.js");

// MODULES
const Router = require("./url/Router.js"); const routes = require("./url/routes.js");
const DataBus = require("./busStation/DataBus.js");
const Language = require("./busStation/Language.js");

// COMPONENTS
const Header = require("./components/Header.js");
const Footer = require("./components/Footer.js");

const App = BaseView.extend(function App () {
  const self = this;

  this.template = function () {
    return [
      [
        "div#app", {
          attrs: {
            "loaded": self.$state.loaded
          },
          class: {
            "app__container": true,
            "flex": true,
            "col": true
          }
        }, [
          [
            "div#header"
          ],
          [
            "div#content"
          ],
          [
            "div#footer"
          ]
        ]
      ]
    ]
  }

  const router = new Router(routes);
  const bus = new DataBus({
    currentSection: "home"
  }, [Language]);

  bus.$on("update:data", function (change) {
    // console.log(change);
  });

  bus.preload().then(res => {
    self.$render();
    router.start(document.getElementById("content"), "home");
  });

});

App.prototype.onRender = function onRender () {
  new Header(document.getElementById("header"), {
    routes: routes
  }, this).$render();
  new Footer(document.getElementById("footer"), null, this).$render();
}

module.exports = function startApp () {
  new App(document.getElementById("app"));
}
