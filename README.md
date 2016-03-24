[<img src="http://www.suitjs.com/img/logo-suitjs.svg?v=2" width="256" alt="SuitJS">](http://www.suitjs.com/)

Make your [SuitJS](http://www.suitjs.com) fancier creating custom web components.

# Install
#### Download
* Download either the `lapel.js` or `lapel.min.js` sources.
* Add the tag `<script src="js/lapel.js"></script>`

#### Bower
* Lapel is available as bower package.
* Run `bower install suitjs-lapel`
* It will install all script versions.
* Add the tag `<script src="bower_components/suitjs-lapel/js/lapel.js"></script>`

#### CDN
* TBD

# Usage
After adding the script tag, the `Lapel` global variable will be available.  
 
#### Hello World
First define a simple component template.

```js
Lapel.add({
    
    //HTML Tag.
    tag: "component",
                            
    //HTML that implements the component.
    //'$text' gets replaced by the 'element.textContent'
    src: "<div class='custom'>$text</div>",
      
    //Callback called when the Element is created.
    init: function(p_element) {              
        console.log(p_element);
    },
    
    //Flag that tells Lapel to replace <component>...</component> by <div>...</div>
    //If 'true', the result will be <component><div>...</div></component>
    inner: false                             
});
```
Then the add the `component` tag in source HTML.
```html
<component>I'm a component.</component>
```
After initialization.
```html
<!-- also will log '<div class='custom'>I'm a component.</div>' -->
<div class='custom'>I'm a component.</div>
```

# Documentation
For in depth information of the API, visit the **[documentation](http://www.suitjs.com/docs/lapel/)**. 

# Examples
Usage examples can be found at **[CodePen](http://codepen.io/collection/XOyEpq/)**.