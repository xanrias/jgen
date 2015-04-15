This method returns angle (in radians) between two points provided as an arguments.

**Arguments:**

  * x1, x2 - coordinates of the first point.
  * y1, y2 - coordinates of the second point.

**Overloaded arguments:**

  * p1 - coordinates of the first point.
  * p2 - coordinates of the second point.

**Example:**

```
// will return: 0.7853981633974483
var iAngle1 = jgen.Math.point2angle(0, 0, 100, 100);

// will return: 1.5707963267948966
var iAngle2 = jgen.Math.point2angle([0, 0], [0, 50]);
```