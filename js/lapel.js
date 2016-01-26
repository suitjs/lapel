(function (console) { "use strict";
var HxOverrides = function() { };
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
var Main = function() { };
Main.main = function() {
	window.Lapel = js_suit_view_Lapel;
	js_suit_view_Lapel.init();
};
var Reflect = function() { };
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var StringTools = function() { };
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var js_suit_view_Lapel = function() { };
js_suit_view_Lapel.init = function() {
	js_suit_view_Lapel.m_has_suit = window.Suit != null;
	js_suit_view_Lapel.m_scheduler_id = -1;
	js_suit_view_Lapel.m_booted = false;
	window.Suit = window.Suit || { view : { components : []}};
	if(!js_suit_view_Lapel.m_has_suit) console.warn("Lapel> Suit framework not found!");
};
js_suit_view_Lapel.find = function(p_component) {
	var l = Suit.view.components;
	var _g1 = 0;
	var _g = l.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(l[i].tag == p_component) return l[i];
	}
	return null;
};
js_suit_view_Lapel.create = function(p_component,p_attribs,p_src) {
	var c;
	if(typeof(p_component) == "string") c = js_suit_view_Lapel.find(p_component); else c = p_component;
	if(c == null) return null;
	var it = window.document.createElement(c.tag);
	if(p_attribs != null) {
		var fl = Reflect.fields(p_attribs);
		var _g = 0;
		while(_g < fl.length) {
			var f = fl[_g];
			++_g;
			it.setAttribute(f,Reflect.getProperty(p_attribs,f));
		}
	}
	if(p_src != null) it.textContent = p_src;
	return it;
};
js_suit_view_Lapel.add = function(p_component) {
	var l = Suit.view.components;
	if(HxOverrides.indexOf(l,p_component,0) >= 0) return;
	var fn = null;
	window.addEventListener(js_suit_view_Lapel.m_has_suit?"component":"load",fn = function(ev) {
		if(js_suit_view_Lapel.m_scheduler_id >= 0) window.clearInterval(js_suit_view_Lapel.m_scheduler_id);
		js_suit_view_Lapel.m_scheduler_id = window.setTimeout(function() {
			js_suit_view_Lapel.boot();
		},1);
		l.push(p_component);
		window.removeEventListener(fn);
	});
};
js_suit_view_Lapel.boot = function() {
	if(!js_suit_view_Lapel.m_booted) {
		js_suit_view_Lapel.m_mutation_lock = false;
		if(window.MutationObserver != null) {
			var mo = new MutationObserver(js_suit_view_Lapel.onMutation);
			mo.observe(window.document.body,{ subtree : true, childList : true});
		} else console.warn("Lapel> MutationObserver not found!");
	}
	js_suit_view_Lapel.schedule();
	js_suit_view_Lapel.m_booted = true;
};
js_suit_view_Lapel.parse = function() {
	var l = Suit.view.components;
	var _g1 = 0;
	var _g = l.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = l[i];
		var l1 = window.document.body.querySelectorAll(c.tag);
		var _g3 = 0;
		var _g2 = l1.length;
		while(_g3 < _g2) {
			var j = _g3++;
			var v = l1[j];
			var attribs = v.attributes;
			var text = v.textContent;
			if(v.isParsed != null) {
				if(v.isParsed) continue;
			}
			v.isParsed = true;
			v.innerHTML = StringTools.replace(c.src,"$text",text);
			js_suit_view_Lapel.parseElement(c,v);
		}
	}
};
js_suit_view_Lapel.parseElement = function(p_component,p_target) {
	var v = p_target;
	var c = p_component;
	haxe_Timer.delay(function() {
		var p = v.parentElement;
		var _g1 = 0;
		var _g = v.children.length;
		while(_g1 < _g) {
			var i = _g1++;
			var vc = v.children[i];
			var _g3 = 0;
			var _g2 = v.classList.length;
			while(_g3 < _g2) {
				var j = _g3++;
				if(!vc.classList.contains(v.classList[j])) vc.classList.add(v.classList[j]);
			}
			var _g31 = 0;
			var _g21 = v.attributes.length;
			while(_g31 < _g21) {
				var j1 = _g31++;
				var a = v.attributes[j1];
				if(a.name == "class") continue;
				vc.setAttribute(a.name,a.value);
			}
		}
		if($bind(c,c.init) != null) c.init(v);
		var is_inner;
		if(c.inner == null) is_inner = true; else is_inner = c.inner;
		if(is_inner) return;
		var p1 = v.parentElement;
		var _g11 = 0;
		var _g4 = v.children.length;
		while(_g11 < _g4) {
			var i1 = _g11++;
			var vc1 = v.children[i1];
			if(v.nextSibling != null) p1.insertBefore(vc1,v); else p1.appendChild(vc1);
		}
		if(p1 != null) p1.removeChild(v);
	},1);
};
js_suit_view_Lapel.onMutation = function(p_list,p_observer) {
	js_suit_view_Lapel.schedule();
};
js_suit_view_Lapel.schedule = function() {
	if(js_suit_view_Lapel.m_mutation_lock) return;
	js_suit_view_Lapel.m_mutation_lock = true;
	js_suit_view_Lapel.parse();
	haxe_Timer.delay(function() {
		js_suit_view_Lapel.m_mutation_lock = false;
	},2);
};
var js_suit_view_LapelComponent = function() { };
js_suit_view_LapelComponent.prototype = {
	init: function(p_target) {
	}
	,register: function() {
		var ref = window.Lapel;
		if(ref != null) ref.add(this);
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
