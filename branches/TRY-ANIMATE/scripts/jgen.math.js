jsface.namespace("jgen");

jsface.def({
	
	$meta: {
		name: "math",
		namespace: jgen,
		singleton: true
	},
	
	DEG_TO_RAD: (180 / Math.PI),
	
	rad2deg: function(rad) {
		return (rad * this.DEG_TO_RAD);
	},
	
	deg2rad: function(deg) {
		return (deg / this.DEG_TO_RAD);
	},
	
	point2distance: [
		function(x1, y1, x2, y2) {
			return Math.sqrt(
				Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
			);
		},
		function(p1, p2) {
			return this.point2distance(
				p1[0], p1[1], p2[0], p2[1]
			);
		}
	],
	
	point2angle: [
		function(x1, y1, x2, y2) {
			return Math.atan2(
				y2 - y1,
				x2 - x1 
			);
		},
		function(p1, p2) {
			return this.point2angle(
				p1[0], p1[1], p2[0], p2[1]
			);
		}
	],
	
	pointOnCircle: [
		function(x, y, angle, radius) {
			return [
				x + Math.cos(angle) * radius,
				y + Math.sin(angle) * radius
			];
		},
		function(p, angle, radius) {
			return this.pointOnCircle(
				p[0], p[1], angle, radius
			);
		}
	],
	
	pointOnLine: [
		function(x1, y1, x2, y2, distance) {
			return jgen.math.pointOnCircle(
				x1, y1,
				jgen.math.point2angle(x1, y1, x2, y2),
				distance
			);
		},
		function(p1, p2, distance) {
			return jgen.math.pointOnCircle(
				p1[0], p1[1],
				jgen.math.point2angle(p1, p2),
				distance
			);
		}
	]
	
});
