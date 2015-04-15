This method controls sprite visibility.

**Arguments:**

  * bVisible - sets sprite visibility.

**Example:**

```
// create sprite
var oExplosion = new jgen.Sprite(...);

// display sprite
oExplosion.setVisible(true);

// wait 5 seconds
setTimeout(function() {
        // hide sprite
        oExplosion.setVisible(false);
}, 5000);
```