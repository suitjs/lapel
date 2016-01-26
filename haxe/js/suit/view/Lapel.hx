package js.suit.view;
import haxe.Timer;
import js.html.Attr;
import js.html.DOMElement;
import js.html.MutationObserver;
import js.html.MutationRecord;
import js.html.NamedNodeMap;

/**
 * Class that manages Suit's framework web components.
 * @author eduardo-costa
 */
class Lapel
{	
	/**
	 * Blocks the mutation handling while components are parsed.
	 */
	static private var m_mutation_lock : Bool;
	
	/**
	 * Flag indicating that the Suit framework is available.
	 */
	static private var m_has_suit : Bool;
	
	/**
	 * Reference to the first parse.
	 */
	static private var m_scheduler_id : Int;
	
	/**
	 * Flag that indicates Lapel has made the first setup.
	 */
	static private var m_booted : Bool;
	
	/**
	 * Init Lapel.
	 */
	static public function init():Void
	{
		m_has_suit = untyped window.Suit != null;
		
		m_scheduler_id = -1;
		
		m_booted = false;
		
		//Polyfill if Suit isn't available
		untyped window.Suit = window.Suit || { view: { components: [] } };
		
		if (!m_has_suit) untyped console.warn("Lapel> Suit framework not found!");
	}
	
	/**
	 * Finds an LapelComponent template if any.
	 * @param	p_component
	 * @return
	 */
	static public function find(p_component:String):LapelComponent
	{
		var l : Array<LapelComponent> = untyped Suit.view.components;
		for (i in 0...l.length) if (l[i].tag == p_component) return l[i];
		return null;
	}
	
	/**
	 * Creates a new instance of a LapelComponent.
	 * @param	p_component
	 * @return
	 */
	@:overload(function (p_component:String,p_attribs : Dynamic=null,p_src:String=null):DOMElement{})
	static public function create(p_component:LapelComponent,p_attribs : Dynamic=null,p_src:String=null):DOMElement
	{
		var c : LapelComponent = Std.is(p_component, String) ? find(cast p_component) : (cast p_component);
		if (c == null) return null;
		
		var it : DOMElement = Browser.document.createElement(c.tag);
		if (p_attribs != null)
		{
			var fl : Array<String> = Reflect.fields(p_attribs);
			for (f in fl) it.setAttribute(f, Reflect.getProperty(p_attribs, f));			
		}
		if (p_src != null) it.textContent = p_src;
		return it;
	}
	
	/**
	 * Register a new component to the component pool.
	 * @param	p_component
	 */
	static public function add(p_component : LapelComponent):Void
	{		
		var l : Array<Dynamic> = untyped Suit.view.components;
		if (l.indexOf(p_component) >= 0) return;
		
		var fn : Dynamic = null;

		Browser.window.addEventListener(m_has_suit ? "component" : "load",
		fn = function(ev)
		{
			if (m_scheduler_id >= 0) Browser.window.clearInterval(m_scheduler_id);
			m_scheduler_id = Browser.window.setTimeout(function() 
			{ 
				boot();
			}, 1);
			
			l.push(p_component);			
			untyped window.removeEventListener(fn);
		});		
	}
	
	/**
	 * Startup Lapel after the first components.
	 */
	static private function boot():Void
	{		
		if (!m_booted)
		{			
			m_mutation_lock = false;
			if (untyped (window.MutationObserver != null))
			{
				var mo : MutationObserver = new MutationObserver(onMutation);
				mo.observe(Browser.document.body, { subtree:true, childList:true } );
			}
			else
			{
				untyped console.warn("Lapel> MutationObserver not found!");
			}
		}		
		
		schedule();
		
		m_booted = true;
	}
	
	/**
	 * Sweeps the DOM and insert components where they should appear.
	 */
	static public function parse():Void
	{		
		var l : Array<Dynamic> = untyped Suit.view.components;
		
		for (i in 0...l.length)
		{
			var c : LapelComponent = l[i];
			var l : Array<DOMElement>   = cast Browser.document.body.querySelectorAll(c.tag);
			for (j in 0...l.length)
			{
				var v : DOMElement = l[j];
				var attribs : NamedNodeMap = v.attributes;				
				var text    : String 	   = v.textContent;
				if (untyped v.isParsed != null) if (untyped v.isParsed) continue;
				untyped v.isParsed  = true;
				v.innerHTML = StringTools.replace(c.src, "$text", text);
				parseElement(c,v);				
			}
		}		
	}
	
	
	
	/**
	 * Finishes parsing the component element.
	 * @param	p_target
	 */
	static private function parseElement(p_component:LapelComponent,p_target:DOMElement):Void
	{
		var v : DOMElement 	= p_target;
		var c : LapelComponent 		= p_component;
		Timer.delay(function() 
		{
			var p   : DOMElement = cast v.parentElement;					
			for (i in 0...v.children.length)
			{	
				var vc : DOMElement = cast v.children[i];				
				for (j in 0...v.classList.length) 
				{ 					
					if(!vc.classList.contains(v.classList[j]))vc.classList.add(v.classList[j]); 					
				}
				for (j in 0...v.attributes.length) 
				{ 
					var a : Attr = v.attributes[j]; 
					if (a.name == "class") continue;
					vc.setAttribute(a.name, a.value); 					
				}
			}
			
			if (c.init != null) c.init(v);
			
			var is_inner : Bool = c.inner == null ? true : c.inner;
			if (is_inner) return;
			var p   : DOMElement = cast v.parentElement;					
			for (i in 0...v.children.length)
			{	
				var vc : DOMElement = cast v.children[i];				
				if (v.nextSibling != null) { p.insertBefore(vc,v); } else { p.appendChild(vc); }						
			}					
			if(p!=null)p.removeChild(v);					
		}, 1);
	}
	
	/**
	 * Callback that handles DOM changes.
	 * @param	p_list
	 * @param	p_observer
	 */
	static private function onMutation(p_list : Array<MutationRecord>, p_observer : MutationObserver):Void
	{
		schedule();
	}
	
	/**
	 * Schedules an atomic callback.
	 */
	static private function schedule():Void
	{
		if (m_mutation_lock) return;
		m_mutation_lock = true;		
		parse();
		Timer.delay(function() { m_mutation_lock = false; }, 2);
	}
	
}