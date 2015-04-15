This method adds new sprite frame to a sprite. The width and heights of the frame will be the same as it was specified in [jgenSprite\_constructor](jgenSprite_constructor.md).

**Arguments:**

  * iFrameX - x position of the frame relative to the spritesheet.
  * iFrameY - y position of the frame relative to the spritesheet.

**Overloaded arguments:**

  * aFramePos - position of the frame relative to the spritesheet.

**Example:**

```
// create sprite
var oExplosion = new jgen.Sprite(...);

// add frames
for (var c = 0; c < 4; c++) oExplosion.addFrame(c * 64, 0);
for (var c = 0; c < 4; c++) oExplosion.addFrame(c * 64, 64);
for (var c = 0; c < 4; c++) oExplosion.addFrame([c * 64, 128]);
for (var c = 0; c < 4; c++) oExplosion.addFrame([c * 64, 192]);

// display sprite
oExplosion.setVisible(true);
```