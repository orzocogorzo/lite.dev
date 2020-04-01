module.exports = function Loader () {

    this.el = document.createElement("div");
    this.el.innerHTML = "<div class=\"loader__wrapper\"><div class=\"loader__content\"></div></div>";
    this.el.id = "loader";

    var visible = false;

    this.show = function show () {
        if (visible) return;
        document.body.appendChild(this.el);
        visible = true;
    }

    this.hide = function hide () {
        if (!visible) return;
        document.body.removeChild(this.el);
        visible = false;
    }
}