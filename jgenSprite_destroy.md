This method will destroy Sprite object and it's HTMLElement.

**Example:**

```
// create sprite
var oExplosion = new jgen.Sprite(...);
// display sprite
oExplosion.setVisible(true);

// wait 5 seconds
setTimeout(function() {
	// destroy sprite
	oExplosion.destroy();
}, 5000);
```