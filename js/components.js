if(Lapel!=null)
{
	//updates the Element in the mdl pool.
	var mdl_update = function(e) { for(var i=0;i<e.children.length;i++) { componentHandler.upgradeElement(e.children[i]); } };
	
	Lapel.add
	({
		tag:    "mdl-button",
		src:    "<button class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>$text</button>",
		inner:  false,		
		init:   function(c) { console.log("mdl-button init"); mdl_update(c); }
	});
	
	Lapel.add
	({
		tag:    "mdl-slider",
		src:    "<input class='mdl-slider mdl-js-slider' type='range' min='0' max='100' value='0' tabindex='0'>",
		inner:  false,		
		init:   function(c) { console.log("mdl-slider init"); mdl_update(c); }
	});
		
}



