This method returns coordinates of the point on the circle, specified by it's center, angle of the point (in radians) and radius.

**Arguments:**

  * x, y - coordinates of the circle.
  * angle - angle (in radians) of the vector.
  * radius - circle's radius.

**Overloaded arguments:**

  * p - coordinates of the circle.
  * angle - angle (in radians) of the vector.
  * radius - circle's radius.

**Example:**

```
// will return an array: [400,100]
var aPoint1 = jgen.Math.pointOnCircle(100, 100, 0, 300);

// will return an array: [150,100]
var aPoint2 = jgen.Math.pointOnCircle([100, 100], 0, 50);
```