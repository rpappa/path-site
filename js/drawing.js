var dx, dy, d2y, dx2, curvature, radius, length;

function equation(start, cp1, cp2, end, len) {
	length = len;
	var xt = start.x + " + " + (3 * (cp1.x-start.x)) +"t + " + (3 * (start.x+cp2.x-2*cp1.x)) + "t^2 + " + ((end.x - start.x + 3 * cp1.x - 3 * cp2.x))+ "t^3"
	$('#xt').text("x(t) = " + xt);
	var yt = start.y + " + " + (3 * (cp1.y-start.y)) +"t + " + (3 * (start.y+cp2.y-2*cp1.y)) + "t^2 + " + ((end.y - start.y + 3 * cp1.y - 3 * cp2.y))+ "t^3"
	$('#yt').text("y(t) = " + yt);

	var dxString = (3 * (cp1.x-start.x)) +" + " + (6 * (start.x+cp2.x-2*cp1.x)) + "t + " + (3 * (end.x - start.x + 3 * cp1.x - 3 * cp2.x))+ "t^2"
	var dyString = (3 * (cp1.y-start.y)) +" + " + (6 * (start.y+cp2.y-2*cp1.y)) + "t + " + (3 * (end.y - start.y + 3 * cp1.y - 3 * cp2.y))+ "t^2"
	var dydxString = `(${(3 * (cp1.y-start.y)) +" + " + (6 * (start.y+cp2.y-2*cp1.y)) + " * t + " + (3 * (end.y - start.y + 3 * cp1.y - 3 * cp2.y))+ " * Math.pow(t, 2)"})/
	(${(3 * (cp1.x-start.x)) +" + " + (6 * (start.x+cp2.x-2*cp1.x)) + " * t + " + (3 * (end.x - start.x + 3 * cp1.x - 3 * cp2.x))+ " * Math.pow(t, 2)"})`
	
	var endAngle = Math.atan2(end.y - cp2.y, end.x-cp2.x) * 180 / Math.PI;
	
	$("#dx").text("dx/dt = " + dxString);
	$('#dy').text("dy/dt = " + dyString);
	$('#len').text("len = " + Math.round(len*1000)/1000 + " end angle: " + Math.round(endAngle*1000)/1000) + "&#176;";
	$('#export').text("/* " + JSON.stringify({start: start, mid1: cp1, mid2: cp2, end:end}) + " */");
	$('#dydx').text(dydxString);

	$('#java').html(`new PathSegment(t -> <br />
		/* ${JSON.stringify({start: start, mid1: cp1, mid2: cp2, end:end})} */<br />
		${dydxString} <br />
		, ${Math.ceil(len)})`);

	dx = function(t) {
		return (
			3 * (end.x + 3 * cp1.x - 3 * cp2.x - start.x) * Math.pow(t, 2) -
			6 * (2 * cp1.x - cp2.x - start.x) * t +
			3 * cp1.x - 3 * start.x
		);
	}

	dy = function(t) {
		return (
			3 * (end.y + 3 * cp1.y - 3 * cp2.y - start.y) * Math.pow(t, 2) -
			6 * (2 * cp1.y - cp2.y - start.y) * t +
			3 * cp1.y - 3 * start.y
		);
	}

	dx2 = function(t) {
		return (6 * (end.x + 3 * cp1.x - 3 * cp2.x - start.x) * t - 6 * (2 * cp1.x - cp2.x - start.x));
	}

	d2y = function(t) { 
		return (6 * (end.y + 3 * cp1.y - 3 * cp2.y - start.y) * t - 6 * (2 * cp1.y - cp2.y - start.y));
	}

	curvature = function(t) {
		return Math.abs(dx(t) * d2y(t) - dy(t) * dx2(t)) 
    				/ Math.pow(Math.pow(dx(t), 2) + Math.pow(dy(t), 2), 1.5);
	}

	radius = function(t) {
		return 1 / curvature(t);
	}

	updateChart();
	generateSpeedFunction();
}

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var curvatureChartCtx;
var curvatureChart;

function generateData(number, dataFunction) {
	let data = [];
	for(i = 0; i <= 1; i+=1/number) {
		data.push({x:Math.round(i*100)/100, y:dataFunction(i)});
	}
	data.push({x:Math.round(1.0*100)/100, y:dataFunction(1.0)});
	console.log(data);
	return data;
}

function updateChart() {
	const number = 35;
	let data = {
		datasets: [{
			label: "Curvature",
			borderColor: window.chartColors.red,
			backgroundColor: window.chartColors.red,
			fill: false,
			data: generateData(number, curvature),
			yAxisID: 'curvatureAxis',
			pointRadius: 2
		},{
			label: "Radius",
			borderColor: window.chartColors.blue,
			backgroundColor: window.chartColors.blue,
			fill: false,
			data: generateData(number, radius),
			yAxisID: 'radiusAxis',
			pointRadius: 2
		}]
	}
	if(!curvatureChart) {
		
	let options = {
		responsive: false,
		hoverMode: 'index',
		stacked: false,
		scales: {
			yAxes: [{
				type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
				display: true,
				position: 'left',
				id: 'curvatureAxis',
			}, {
				type: 'logarithmic', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
				display: true,
				position: 'right',
				id: 'radiusAxis',
				// grid line settings
				gridLines: {
					drawOnChartArea: false, // only want the grid lines for one axis to show up
				},
			}],
			xAxes: [{
				type:'linear',
				positon:'bottom',
				ticks: {
					min: 0,
					max: 1.0,
					stepSize: 0.25
				}
			}]
		}
	}
		curvatureChart = new Chart(curvatureChartCtx, {
			type: 'line',
			data: data,
			options: options
		});
	} else {
		curvatureChart.data.datasets = data.datasets;
		curvatureChart.update(3);
	}
}

var speedChartCtx;
var speedChart;
var speedFunction;

function generateSpeedFunction() {
	if(!curvature) {
		return;
	}

	const minSpeed = parseFloat($('#minspeed').val());
	const maxSpeed = parseFloat($('#maxspeed').val());
	const accel = parseFloat($('#accel').val())/100;
	const radius1 = parseFloat($('#radius1').val());
	const radius2 = parseFloat($('#radius2').val());
	const lookahead = parseFloat($('#lookahead').val());
	speedFunction = function(t) {
		const inchesTraveled = t * length;
		const inchesToGo = (1 - t) * length;

		// the speed as we speed up from start
		const speedUpSpeed = minSpeed + inchesTraveled * accel;
		// the speed as we slow down to end
		const slowDownSpeed = minSpeed + inchesToGo * accel;

		let turnSpeed = maxSpeed;
		const lookaheadt = t + lookahead/length;
		if(radius(lookaheadt) <= radius1) {
			turnSpeed = maxSpeed - (curvature(lookaheadt) - 1/radius1)/(1/radius2 - 1/radius1) * (maxSpeed - minSpeed);
		}

		let outSpeed = Math.min(speedUpSpeed, slowDownSpeed, turnSpeed, maxSpeed);
		if(outSpeed < minSpeed) {
			outSpeed = minSpeed;
		}
		return outSpeed;
	}

	const number = 40;
	let data = {
		datasets: [{
			label: "Speed",
			borderColor: window.chartColors.red,
			backgroundColor: window.chartColors.red,
			fill: false,
			data: generateData(number, speedFunction),
			yAxisID: 'speedAxis',
			pointRadius: 2
		}]
	}
	if(!speedChart) {
	let options = {
		responsive: false,
		hoverMode: 'index',
		stacked: false,
		scales: {
			yAxes: [{
				type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
				display: true,
				position: 'left',
				id: 'speedAxis',
			}],
			xAxes: [{
				type:'linear',
				positon:'bottom',
				ticks: {
					min: 0,
					max: 1.0,
					stepSize: 0.25
				}
			}]
		}
	}
		speedChart = new Chart(speedChartCtx, {
			type: 'line',
			data: data,
			options: options
		});
	} else {
		speedChart.data.datasets = data.datasets;
		speedChart.update(3);
	}
}

$(document).ready(function() {
	curvatureChartCtx = $("#curvatureChart");
	speedChartCtx = $("#speedChart");

	$('#generate').click(generateSpeedFunction);
	$('#beta').click(function() {
		$(".beta").toggle(this.checked);
	});
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