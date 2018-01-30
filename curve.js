var curve = false;
var B = {x: 100, y: 50};
var tvalues = [0.2, 0.3, 0.4, 0.5];
var curves = tvalues.map(function(t) {
	return Bezier.cubicFromPoints({x: 0, y: 0}, {x: 24, y: 30}, {x: 30, y: 24}, t, 7);
});
var draw = function() {
	var offset = {x:10,y:10};
	curves.forEach(function(b,i) {
	//drawSkeleton(b, offset, true);
	setColor("rgba(0,0,0,0.2)");
		drawCircle(b.points[1], 3, offset);
	drawText("t="+tvalues[i], {
		x: b.points[1].x + offset.x - 15,
		y: b.points[1].y + offset.y - 10,
	});
	setRandomColor();
	drawCurve(b, offset);
});
setColor("black");
drawCircle(curves[0].points[0], 3, offset);
drawCircle(curves[0].points[1], 3, offset);
drawCircle(curves[0].points[2], 3, offset);