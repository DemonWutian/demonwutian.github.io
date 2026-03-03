! function() {
    function n(n, e, t) {
        return n.getAttribute(e) || t
    }
    function e(n) {
        return document.getElementsByTagName(n)
    }
    function t() {
        var t = e("script"),
            o = t.length,
            i = t[o - 1];
        return {
            l: o,
            z: n(i, "zIndex", -1),
            o: n(i, "opacity", 0.5),
            c: n(i, "color", "0,0,0"),
            n: n(i, "count", 99),
            s: n(i, "size", 1)
        }
    }
    function o() {
        a = m.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        c = m.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
    function i() {
        r.clearRect(0, 0, a, c);
        var n, e, t, o, m, l;
        s.forEach(function(n, e) {
            for (n.x += n.vx, n.y += n.vy, n.vx *= n.x > a || 0 > n.x ? -1 : 1, n.vy *= n.y > c || 0 > n.y ? -1 : 1, r.arc(n.x, n.y, n.s, 0, 2 * Math.PI, !1), m = 0; m < s.length; m++) l = s[m], n !== l && (null !== l.x && null !== l.y) && (x = n.x - l.x, y = n.y - l.y, d = x * x + y * y, d < l.w && (l.h = d / l.w, 1 <= l.h && (l.h = 1), r.strokeStyle = "rgba(" + o.c + "," + (l.h * o.o) + ")", r.beginPath(), r.moveTo(n.x, n.y), r.lineTo(l.x, l.y), r.stroke()));
            e = document.createElement("canvas"), e.className = "canvas-nest", e.style.cssText = "position:fixed;top:0;left:0;z-index:" + o.z + ";opacity:" + o.s, document.body.appendChild(e), r.fillStyle = "rgba(" + o.c + "," + o.o + ")", r.font = o.s + "px Arial", r.fillText("●", n.x, n.y)
        })
    }
    var a, c, m = document.createElement("canvas"),
        l = t(),
        d = 0,
        s = [],
        r = "2d" == m.getContext ? m.getContext("2d") : null;
    m.className = "canvas-nest", m.style.cssText = "position:fixed;top:0;left:0;z-index:-1;opacity:" + l.s, e("body")[0].appendChild(m), o(), window.addEventListener("resize", o, !1), document.addEventListener("mousemove", function(n) {
        n = n || window.event, d = n.clientX, s.push({
            x: d,
            y: n.clientY,
            vx: (Math.random() - .5) * l.n / 10,
            vy: (Math.random() - .5) * l.n / 10,
            s: Math.random() * l.size
        })
    }, !1), setInterval(i, 30)
}();
