This method sets the sprite's to the specified frame number. Frame number must be valid frame number returned by [jgenSprite\_addFrame](jgenSprite_addFrame.md).

**Arguments:**

  * iFrameNumber - frame number to set

**Example:**

```
// create sprite
var oExplosion = new jgen.Sprite(...);

// add frames
for (var c = 0; c < 4; c++) oExplosion.addFrame(c * 64, 0);
for (var c = 0; c < 4; c++) oExplosion.addFrame(c * 64, 64);
for (var c = 0; c < 4; c++) oExplosion.addFrame(c * 64, 128);
for (var c = 0; c < 4; c++) oExplosion.addFrame(c * 64, 192);

// display sprite
oExplosion.setVisible(true);

var iFrame = 0;
// change sprite's frame every 250 ms
setInterval(function() {
	oExplosion.setFrame(iFrame);
	iFrame++;
	if (iFrame > 15) iFrame = 0;
}, 250);
```