function onClickOut (el, cb) {
    function onClick (ev) {
        if (el.contains(ev.target) || el == ev.target) return;
        document.body.removeEventListener("click", onClick, true);
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();
        cb(ev);
    }

    document.body.addEventListener("click", onClick, true);

    return function unbind () {
        document.body.removeEventListener("click", onClick, true);
    }
}

function capitalize (prop) {
    return prop[0].toUpperCase() + prop.slice(1);
}

module.exports = {
    onClickOut: onClickOut,
    capitalize: capitalize
}