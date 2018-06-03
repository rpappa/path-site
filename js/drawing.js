function equation(start, cp1, cp2, end, len) {
	var xt = start.x + " + " + (3 * (cp1.x-start.x)) +"t + " + (3 * (start.x+cp2.x-2*cp1.x)) + "t^2 + " + ((end.x - start.x + 3 * cp1.x - 3 * cp2.x))+ "t^3"
	$('#xt').text("x(t) = " + xt);
	var yt = start.y + " + " + (3 * (cp1.y-start.y)) +"t + " + (3 * (start.y+cp2.y-2*cp1.y)) + "t^2 + " + ((end.y - start.y + 3 * cp1.y - 3 * cp2.y))+ "t^3"
	$('#yt').text("y(t) = " + yt);

	var dx = (3 * (cp1.x-start.x)) +" + " + (6 * (start.x+cp2.x-2*cp1.x)) + "t + " + (3 * (end.x - start.x + 3 * cp1.x - 3 * cp2.x))+ "t^2"
	var dy = (3 * (cp1.y-start.y)) +" + " + (6 * (start.y+cp2.y-2*cp1.y)) + "t + " + (3 * (end.y - start.y + 3 * cp1.y - 3 * cp2.y))+ "t^2"
	var dydx = `(${(3 * (cp1.y-start.y)) +" + " + (6 * (start.y+cp2.y-2*cp1.y)) + " * t + " + (3 * (end.y - start.y + 3 * cp1.y - 3 * cp2.y))+ " * Math.pow(t, 2)"})/
	(${(3 * (cp1.x-start.x)) +" + " + (6 * (start.x+cp2.x-2*cp1.x)) + " * t + " + (3 * (end.x - start.x + 3 * cp1.x - 3 * cp2.x))+ " * Math.pow(t, 2)"})`
	
	var endAngle = Math.atan2(end.y - cp2.y, end.x-cp2.x) * 180 / Math.PI;
	
	$("#dx").text("dx/dt = " + dx);
	$('#dy').text("dy/dt = " + dy);
	$('#len').text("len = " + Math.round(len*1000)/1000 + " end angle: " + Math.round(endAngle*1000)/1000) + "&#176;";
	$('#export').text("/* " + JSON.stringify({start: start, mid1: cp1, mid2: cp2, end:end}) + " */");
	$('#dydx').text(dydx);

	$('#java').html(`new PathSegment(t -> <br />
		/* ${JSON.stringify({start: start, mid1: cp1, mid2: cp2, end:end})} */<br />
		${dydx} <br />
		, ${Math.ceil(len)})`);
}

$(document).ready(function() {
	// drawFieldImage(0.5);
	var start = {x: 100, y: 25};
	var mid1 = {x: 10, y: 90};
	var mid2 = {x: 110, y: 100};
	var end = {x: 150, y: 195};
	$('input').change(function() {
		let curve =new Bezier(start , mid1 , mid2 , end);
		draw(curve);
		equation(start, mid1, mid2, end, curve.length());
	});
	$('#startx').change(function() {
		start.x = parseFloat($(this).val());
	});
	$('#starty').change(function() {
		start.y = parseFloat($(this).val());
	});

	$('#mid1x').change(function() {
		mid1.x = parseFloat($(this).val());
	});
	$('#mid1y').change(function() {
		mid1.y = parseFloat($(this).val());
	});

	$('#mid2x').change(function() {
		mid2.x = parseFloat($(this).val());
	});
	$('#mid2y').change(function() {
		mid2.y = parseFloat($(this).val());
	});

	$('#endx').change(function() {
		end.x = parseFloat($(this).val());
	});
	$('#endy').change(function() {
		end.y = parseFloat($(this).val());
	});
	$('#importtext').click(function() {
		let imp = JSON.parse($("#import").val());
		start.x = imp.start.x;
		start.y = imp.start.y;

		mid1.x = imp.mid1.x;
		mid1.y = imp.mid1.y;

		mid2.x = imp.mid2.x;
		mid2.y = imp.mid2.y;

		end.x = imp.end.x;
		end.y = imp.end.y;

		$('#startx').val(start.x);
		$('#starty').val(start.y);

		$('#endx').val(end.x);
		$('#endy').val(end.y);

		$('#mid1x').val(mid1.x);
		$('#mid1y').val(mid1.y);

		$('#mid2x').val(mid2.x);
		$('#mid2y').val(mid2.y);
		
		let curve =new Bezier(start , mid1 , mid2 , end);
		draw(curve);
		equation(start, mid1, mid2, end, curve.length());
	});

	$('#mirror').click(()=>{
		let old = JSON.parse(JSON.stringify({start: start, mid1: mid1, mid2:mid2, end: end})); // sketchy hack to copy not reference

		start.x = old.start.x;
		start.y = old.start.y;

		mid1.x = old.mid1.x;
		mid1.y = start.y + (old.start.y - old.mid1.y);

		mid2.x = old.mid2.x;
		mid2.y = start.y + (old.start.y - old.mid2.y);

		end.x = old.end.x;
		end.y = start.y + (old.start.y - old.end.y);

		$('#startx').val(start.x);
		$('#starty').val(start.y);

		$('#endx').val(end.x);
		$('#endy').val(end.y);

		$('#mid1x').val(mid1.x);
		$('#mid1y').val(mid1.y);

		$('#mid2x').val(mid2.x);
		$('#mid2y').val(mid2.y);
		
		let curve =new Bezier(start , mid1 , mid2 , end);
		draw(curve);
		equation(start, mid1, mid2, end, curve.length());
	});

	$('#reverse').click(()=>{
		let old = JSON.parse(JSON.stringify({start: start, mid1: mid1, mid2:mid2, end: end})); // sketchy hack to copy not reference

		start.x = old.end.x;
		start.y = old.end.y;

		mid1.x = old.mid2.x;
		mid1.y = old.mid2.y;

		mid2.x = old.mid1.x;
		mid2.y = old.mid1.y;

		end.x = old.start.x;
		end.y = old.start.y;

		$('#startx').val(start.x);
		$('#starty').val(start.y);

		$('#endx').val(end.x);
		$('#endy').val(end.y);

		$('#mid1x').val(mid1.x);
		$('#mid1y').val(mid1.y);

		$('#mid2x').val(mid2.x);
		$('#mid2y').val(mid2.y);
		
		let curve =new Bezier(start , mid1 , mid2 , end);
		draw(curve);
		equation(start, mid1, mid2, end, curve.length());
	});

	$('#offset').click(()=>{
		let x = parseFloat($('#offx').val());
		let y = parseFloat($('#offy').val());

		start.x = start.x + x;
		start.y = start.y + y;

		mid1.x = mid1.x + x;
		mid1.y = mid1.y + y;

		mid2.x = mid2.x + x;
		mid2.y = mid2.y + y;

		end.x = end.x + x;
		end.y = end.y + y;

		$('#startx').val(start.x);
		$('#starty').val(start.y);

		$('#endx').val(end.x);
		$('#endy').val(end.y);

		$('#mid1x').val(mid1.x);
		$('#mid1y').val(mid1.y);

		$('#mid2x').val(mid2.x);
		$('#mid2y').val(mid2.y);
		
		let curve =new Bezier(start , mid1 , mid2 , end);
		draw(curve);
		equation(start, mid1, mid2, end, curve.length());
	});

	function updateFromCurve(otherCurve) {
		if(otherCurve.points.length < 4) {
			return;
		}
		// console.log(otherCurve.points[0]);

		start = otherCurve.points[0];
		mid1 = otherCurve.points[1];
		mid2 = otherCurve.points[2];
		end = otherCurve.points[3];

		// console.log(start)

		delete start.t;
		delete start.d;
		delete end.t;
		delete end.d;

		$('#startx').val(start.x);
		$('#starty').val(start.y);
	
		$('#endx').val(end.x);
		$('#endy').val(end.y);
	
		$('#mid1x').val(mid1.x);
		$('#mid1y').val(mid1.y);
	
		$('#mid2x').val(mid2.x);
		$('#mid2y').val(mid2.y);
		// console.log(start, mid1, mid2, end);
		let curve =new Bezier(start, mid1, mid2, end);
		draw(curve);
		equation(start, mid1, mid2, end, curve.length());
	}

	window.updateFromCurve = updateFromCurve;

	$(document).keypress((e)=>{
		update();
	});

	//setInterval(update, 100);
});

window.updateFromCurve = function(){};

function update() {
	start.x = parseFloat($('#startx').val());
	start.y = parseFloat($('#starty').val());

	mid1.x = parseFloat($('#mid1x').val());
	mid1.y = parseFloat($('#mid1y').val());

	mid2.x = parseFloat($('#mid2x').val());
	mid2.y = parseFloat($('#mid2y').val());

	end.x = parseFloat($('#endx').val());
	end.y = parseFloat($('#endy').val());

	// $('#startx').val(start.x);
	// $('#starty').val(start.y);

	// $('#endx').val(end.x);
	// $('#endy').val(end.y);

	// $('#mid1x').val(mid1.x);
	// $('#mid1y').val(mid1.y);

	// $('#mid2x').val(mid2.x);
	// $('#mid2y').val(mid2.y);

	curve = new Bezier(start , mid1 , mid2 , end);
	draw(curve);
	equation(start, mid1, mid2, end, curve.length());
}

window.curve = new Bezier(100,25 , 10,90 , 110,100 , 150,195);