This method sets sprite position.

**Arguments:**

  * iSpriteX - x position of the sprite.
  * iSpriteY - y position of the sprite.

**Overloaded arguments:**

  * aPosition - position of the sprite.

**Example:**

```
// create sprite
var oExplosion = new jgen.Sprite(...);

// set sprite position
oExplosion.setPosition(200, 200);

// display sprite
oExplosion.setVisible(true);

// wait 5 seconds
setTimeout(function() {
	// move sprite into new position
	oExplosion.setPosition([0, 0]);
}, 5000);
```