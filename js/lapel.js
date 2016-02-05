var Lapel =
function(window,document,body)
{

	/**
	 * Blocks the mutation handling while components are parsed.
	 */
	var m_mutationLock = false;
	
	
	/**
	 * Reference to the first parse.
	 */
	var m_schedulerId = -1;
	
	/**
	 * Flag that indicates Lapel has made the first setup.
	 */
	var m_booted = false;

	/**
	Flag that indicates the Suit core framework exists in the page.
	//*/
	var m_hasSuit = window.Suit != null;

	/**
	Container for loaded components.
	//*/
	var m_components = [];

	/**
	Helper function to validate if a variable is null or the wrong type and return a default result.
	//*/
	function assert(v,d,t) { return t==null ? (v==null ? d : v) : ((typeof(v)==t) ? v : d);	}

	/**
	 * Finds an LapelComponent template if any.
	 * @param	p_tag
	 * @return
	 */
	var lapelFind = 
	function find(p_tag) {

		var l = Lapel.components;
		for (var i=0;i<l.length;i++) if (l[i].tag == p_tag) return l[i];
		return null;
	};

	/**
	Creates a new instance of a LapelComponent.
	//*/
	var lapelCreate =
	function create(p_tag,p_attribs,p_src) {

		var c = (typeof(p_tag)=="string") ? Lapel.find(p_tag) : p_tag;

		if (c == null) return null;
		
		var it = document.createElement(c.tag);
		
		if (p_attribs != null) for(var s in p_attribs) it.setAttribute(s,p_attribs[s]);
		
		if (p_src != null) it.textContent = p_src;

		return it;
	};

	/**
	Register a new component to the component pool.
	//*/
	var lapelAdd =
	function add(p_component) {		

		var l = Lapel.components;
		if (l.indexOf(p_component) >= 0) return p_component;
		
		var fn = null;

		window.addEventListener(m_hasSuit ? "component" : "load",
		fn = function lapelOnInit(ev) {

			if (m_schedulerId >= 0) window.clearInterval(m_schedulerId);
			m_schedulerId = window.setTimeout(function() { m_lapelBoot(); }, 1);			
			l.push(p_component);
			window.removeEventListener(fn);
		});		

		return p_component;
	};

	/**
	 * Startup Lapel after the first components.
	 */
	var m_lapelBoot = 
	function boot() {		

		if (!m_booted) {			

			m_mutationLock = false;
			if (window.MutationObserver != null) {

				var mo = new MutationObserver(m_lapelOnMutation);
				mo.observe(body, { subtree:true, childList:true } );
			}
			else {

				console.warn("Lapel> MutationObserver not found!");
			}
		}
		
		m_lapelSchedule();
		
		m_booted = true;
	};

	/**
	 * Sweeps the DOM and insert components where they should appear.
	 */
	var m_lapelParse =
	function parse() {		

		var cl = Lapel.components;
		
		for (var i=0;i<cl.length;i++) {

			var c = cl[i];
			var l = body.querySelectorAll(c.tag);

			for (var j=0;j<l.length;j++) {				

				var v 		= l[j];
				var attribs = v.attributes;				
				var text    = v.textContent;

				if (v.isParsed != null) if (v.isParsed) continue;

				v.isParsed  = true;				
				v.innerHTML = c.src.replace("$text", text);

				m_lapelParseElement(c,v);
			}
		}		
	};

	/**
	 * Finishes parsing the component element.
	 * @param	p_target
	 */
	var m_lapelParseElement =
	function parseElement(p_component,p_target) 	{

		var v = p_target;
		var c = p_component;

		window.setTimeout(
		function() {

			var p = v.parentElement;					
			for (var i=0; i<v.children.length;i++) {	

				var vc = v.children[i];
				for (var j=0;j<v.classList.length;j++) { 					

					if(!vc.classList.contains(v.classList[j])) vc.classList.add(v.classList[j]);
				}
				
				for (var j=0;j<v.attributes.length;j++) { 

					var a = v.attributes[j]; 
					if (a.name == "class") continue;
					vc.setAttribute(a.name, a.value);
				}
			}
			
			if (c.init != null) c.init(v);
			
			var is_inner = c.inner == null ? true : c.inner;

			if (is_inner) return;

			var p = v.parentElement;					
			for (var i=0;i<v.children.length;i++) {	

				var vc = v.children[i];				
				if (v.nextSibling != null) { p.insertBefore(vc,v); } else { p.appendChild(vc); }
			}					
			if(p!=null)p.removeChild(v);					

		}, 1);
	};

	/**
	 * Callback that handles DOM changes.
	 * @param	p_list
	 * @param	p_observer
	 */
	var m_lapelOnMutation =
	function onMutation(p_records,p_observer) {

		m_lapelSchedule();
	};


	/**
	 * Schedules an atomic callback.
	 */
	var m_lapelSchedule =
	function schedule() {

		if (m_mutationLock) return;

		m_mutationLock = true;		
		m_lapelParse();
		window.setTimeout(function() { m_mutationLock = false; }, 2);
	};


	return {
		
		components: m_components,
		find: 		lapelFind,	
		create: 	lapelCreate,
		add:        lapelAdd,
	};

}(window,document,document.body);