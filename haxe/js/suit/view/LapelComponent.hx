package js.suit.view;
import js.html.DOMElement;

/**
 * Class that describes a View prefab component.
 * @author eduardo-costa
 */
extern class LapelComponent
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
	 * Callback called when the component is created.
	 */
	public var init : DOMElement->Void;
	
	/**
	 * Flag that indicates the component's src must stay inside the tag.
	 */
	public var inner : Bool;
		
}