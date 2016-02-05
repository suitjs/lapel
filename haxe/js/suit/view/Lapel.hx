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
extern class Lapel
{	
	/**
	 * Finds an LapelComponent template if any.
	 * @param	p_component
	 * @return
	 */
	static public function find(p_component:String):LapelComponent;
	
	/**
	 * Creates a new instance of a LapelComponent.
	 * @param	p_component
	 * @return
	 */
	@:overload(function (p_component:String,p_attribs : Dynamic=null,p_src:String=null):DOMElement{})
	static public function create(p_component:LapelComponent, p_attribs : Dynamic = null, p_src:String = null):DOMElement;
	
	/**
	 * Register a new component to the component pool.
	 * @param	p_component
	 */
	static public function add(p_component : LapelComponent):LapelComponent;
	
	
}