This method will clone Sprite object and return a new one.

**Example:**

```
// create sprite
var oExplosionSprite = new jgen.Sprite(...);

// clone sprites in the loop
for (var c = 0; c < 5; c++) {
	// clone initial sprite
	var oExplosion = oExplosionSprite.clone();
	// set position
	oExplosion.setPosition(c * 5, c * 5);
	// display sprite
	oExplosion.setVisible(true);
}
```