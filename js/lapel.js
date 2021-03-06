var Lapel = {};

(function(window, document, body) {
    "use strict";
    console.log("Lapel> Init v1.0.0");
    var m_mutationLock = false;
    var m_schedulerId = -1;
    var m_booted = false;
    var m_hasSuit = window.Suit != null;
    Lapel.components = [];
    function assert(v, d, t) {
        return t == null ? v == null ? d : v : typeof v == t ? v : d;
    }
    Lapel.find = function find(p_tag) {
        var l = Lapel.components;
        for (var i = 0; i < l.length; i++) if (l[i].tag == p_tag) return l[i];
        return null;
    };
    Lapel.create = function create(p_tag, p_attribs, p_src) {
        var c = typeof p_tag == "string" ? Lapel.find(p_tag) : p_tag;
        if (c == null) {
            console.error("Lapel> Component [" + p_tag + "] not found");
            return null;
        }
        var it = document.createElement(c.tag);
        if (p_attribs != null) for (var s in p_attribs) it.setAttribute(s, p_attribs[s]);
        if (p_src != null) it.textContent = p_src;
        return it;
    };
    Lapel.add = function add(p_component) {
        var l = Lapel.components;
        if (l.indexOf(p_component) >= 0) return p_component;
        var fn = null;
        var evt = m_hasSuit ? "component" : "load";
        window.addEventListener(evt, fn = function lapelOnInit(ev) {
            if (m_schedulerId >= 0) window.clearInterval(m_schedulerId);
            m_schedulerId = window.setTimeout(function() {
                m_lapelBoot();
            }, 1);
            l.push(p_component);
            window.removeEventListener(evt, fn);
        });
        if (p_component.inner == null) p_component.inner = true;
        if (p_component.init == null) p_component.init = null;
        return p_component;
    };
    var m_lapelBoot = function boot() {
        if (!m_booted) {
            m_mutationLock = false;
            if (window.MutationObserver != null) {
                var mo = new MutationObserver(m_lapelOnMutation);
                mo.observe(body, {
                    subtree: true,
                    childList: true
                });
            } else {
                console.warn("Lapel> MutationObserver not found!");
            }
        }
        m_lapelSchedule();
        m_booted = true;
    };
    var m_lapelParse = function parse() {
        var cl = Lapel.components;
        for (var i = 0; i < cl.length; i++) {
            var c = cl[i];
            var l = body.querySelectorAll(c.tag);
            for (var j = 0; j < l.length; j++) {
                var v = l[j];
                var attribs = v.attributes;
                var text = v.textContent;
                if (v.isParsed != null) if (v.isParsed) continue;
                v.isParsed = true;
                v.innerHTML = c.src.replace("$text", text);
                m_lapelParseElement(c, v);
            }
        }
    };
    var m_lapelParseElement = function parseElement(p_component, p_target) {
        var v = p_target;
        var c = p_component;
        window.setTimeout(function() {
            var p = v.parentElement;
            for (var i = 0; i < v.children.length; i++) {
                var vc = v.children[i];
                for (var j = 0; j < v.classList.length; j++) {
                    if (!vc.classList.contains(v.classList[j])) vc.classList.add(v.classList[j]);
                }
                for (var j = 0; j < v.attributes.length; j++) {
                    var a = v.attributes[j];
                    if (a.name == "class") continue;
                    vc.setAttribute(a.name, a.value);
                }
            }
            var is_inner = c.inner == null ? true : c.inner;
            if (is_inner) {
                if (c.init != null) c.init(v);
                return;
            }
            var l = [];
            var p = v.parentElement;
            for (var i = 0; i < v.children.length; i++) {
                var vc = v.children[i];
                l.push(vc);
                if (v.nextSibling != null) {
                    p.insertBefore(vc, v);
                } else {
                    p.appendChild(vc);
                }
            }
            if (l.length == 1) {
                if (c.init != null) c.init(l[0]);
            } else if (l.length > 1) {
                if (c.init != null) c.init(l);
            } else if (c.init != null) c.init();
            if (p != null) p.removeChild(v);
        }, 1);
    };
    var m_lapelOnMutation = function onMutation(p_records, p_observer) {
        m_lapelSchedule();
    };
    var m_lapelSchedule = function schedule() {
        if (m_mutationLock) return;
        m_mutationLock = true;
        m_lapelParse();
        window.setTimeout(function() {
            m_mutationLock = false;
        }, 2);
    };
})(window, document, document.body);