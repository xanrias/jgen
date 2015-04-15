This method returns distance between two points provided as an arguments.

**Arguments:**

  * x1, x2 - coordinates of the first point.
  * y1, y2 - coordinates of the second point.

**Overloaded arguments:**

  * p1 - coordinates of the first point.
  * p2 - coordinates of the second point.

**Example:**

```
// will return: 141.4213562373095
var iDistance1 = jgen.Math.point2distance(0, 0, 100, 100);

// will return: 70.71067811865476
var iDistance2 = jgen.Math.point2distance([0, 0], [50, 50]);
```