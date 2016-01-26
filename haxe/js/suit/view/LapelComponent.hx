package js.suit.view;
import js.html.DOMElement;

/**
 * Class that describes a View prefab component.
 * @author eduardo-costa
 */
class LapelComponent
{
	/**
	 * Tag that represent this component.
	 */
	public var tag : String;
	
	/**
	 * HTML source of this component.
	 */
	public var src : String;
	
	/**
	 * Flag that indicates the component's src must stay inside the tag.
	 */
	public var inner : Bool;
	
	/**
	 * Callback called when this component is initialized with a new instance.
	 */
	public function init(p_target:DOMElement):Void { }
	
	/**
	 * Register this LapelComponent into the component pool.
	 */
	public function register():Void
	{
		var ref : Dynamic = untyped window.Lapel;
		if (ref != null) ref.add(this);
	}
		
}