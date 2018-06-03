function handleInteraction(cvs, curve) {
  curve.mouse = false;

  var fix = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        rect = target.getBoundingClientRect();
    e.offsetX = e.clientX - rect.left;
    e.offsetY = e.clientY - rect.top;
  };

  var lpts = curve.points;
  var moving = false, mx = my = ox = oy = 0, cx, cy, mp = false;

  var handler = { onupdate: function() {} };

  cvs.addEventListener("mousedown", function(evt) {
    fix(evt);
    mx = evt.offsetX-5;
    my = evt.offsetY-50;
    lpts.forEach(function(p) {
      // console.log(p)
      // console.log(mx, my)
      if(Math.abs(mx-p.x)<10 && Math.abs(my-p.y)<10) {
        moving = true;
        mp = p;
        cx = p.x;
        cy = p.y;
      }
    });
  });

  cvs.addEventListener("mousemove", function(evt) {
    fix(evt);

    var found = false;

    if(!lpts) return;
    lpts.forEach(function(p) {
      var mx = evt.offsetX-5;
      var my = evt.offsetY-50;
      let closePoint = curve.project({x: mx, y: my});
      if(!moving && Math.sqrt(Math.pow(mx - closePoint.x, 2) + Math.pow(my - closePoint.y, 2) ) < 9) {
        // console.log(closePoint)
        window.closePoint = closePoint;
      } else {
        window.closePoint = false;
      }
      if(Math.abs(mx-p.x)<10 && Math.abs(my-p.y)<10) {
        found = found || true;
      }
    });
    cvs.style.cursor = found ? "pointer" : "default";

    if(!moving) {
      return handler.onupdate(evt);
    }

    ox = evt.offsetX -5 - mx;
    oy = evt.offsetY -50 - my;
    mp.x = cx + ox;
    mp.y = cy + oy;
    curve.update();
    handler.onupdate();
  });

  cvs.addEventListener("mouseup", function(evt) {
    if(!moving) return;
    // console.log(curve.points.map(function(p) { return p.x+", "+p.y; }).join(", "));
    moving = false;
    mp = false;
  });

  cvs.addEventListener("click", function(evt) {
    fix(evt);
    var mx = evt.offsetX-5;
    var my = evt.offsetY-50;
  });

  return handler;
}
