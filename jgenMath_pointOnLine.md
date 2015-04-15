This method returns coordinates of the point on the line, specified by it's coordinates and the distance from it's first coordinate.

**Arguments:**

  * x1, y1 - coordinates of the first line's point.
  * x2, y2 - coordinates of the second line's point.
  * distance - distance from the first line's point.

**Overloaded arguments:**

  * p1 - coordinates of the first line's point.
  * p1 - coordinates of the second line's point.
  * distance - distance from the first line's point.

**Example:**

```
// will return an array: [21.213203435596427, 21.213203435596423]
var aPoint1 = jgen.Math.pointOnLine(0, 0, 100, 100, 30);

// will return an array: [7.0710678118654755, 7.071067811865475]
var aPoint2 = jgen.Math.pointOnLine([0, 0], [50, 50], 10);
```