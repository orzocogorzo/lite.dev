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

function lazyLoad (imgs) {
    const io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.lazysrc;
                entry.target.onload = function () {
                    this.style.filter = "blur(0px)";
                }
                io.unobserve(entry.target);
            }
        });
    });

    imgs.forEach(img => {
        img.style.filter = "blur(5px)";
        io.observe(img);
    });
}

module.exports = {
    onClickOut: onClickOut,
    capitalize: capitalize,
    lazyLoad: lazyLoad
}