function Slider(st, en, val) {
  var div = document.createElement("div");
  div.style.display = "inline-block";
  div.style.position = "relative";
  div.style.width = "200px";
  div.style.height = "10px";

  var w = 200;
  var h = 20;

  this.node = function() {
    return div;
  }

  this.width = function(wid) {
    w = wid;
    div.style.width = w+"px";
    this.resize();
  }

  this.height = function(hei) {
    h = hei;
    div.style.height = h+"px";
    this.resize();
  }

  var bar = document.createElement("div");
  div.appendChild(bar);
  bar.style.borderRadius = "5px";
  bar.style.width = "100%";
  bar.style.height = "75%";
  bar.style.display = "block";
  bar.style.position = "absolute";
  bar.style.backgroundColor = "#BBBBBB";

  var inner_bar = document.createElement("div");
  div.appendChild(inner_bar);
  inner_bar.style.height = "33%";
  inner_bar.style.display = "block";
  inner_bar.style.position = "absolute";
  inner_bar.style.backgroundColor = "#DDDDDD";

  var start = st;
  var end = en;

  var left_value = val;
  if(val == null) {
    left_value = 0.5;
  }

  var right_value = end - (left_value - start);

  var left_knob = document.createElement("div");
  left_knob.style.border = "1px solid #FFFFFF";
  left_knob.style.borderRadius = "5px";
  left_knob.style.cursor = "pointer";
  left_knob.style.backgroundColor = "#888888";
  left_knob.style.position = "absolute";
  left_knob.style.top = 0;

  var right_knob = document.createElement("div");
  right_knob.style.border = "1px solid #FFFFFF";
  right_knob.style.borderRadius = "5px";
  right_knob.style.cursor = "pointer";
  right_knob.style.backgroundColor = "#888888";
  right_knob.style.position = "absolute";
  right_knob.style.top = 0;

  this.resize = function() {
    // fix rounding issue
    var wiggle = 0.000001; // -- NOTE: this number should be 1) less than the steps on your slider and 2) more than the floating-point precision error
    left_value = Math.floor(left_value * 100 + wiggle) / 100.0;
    right_value = Math.ceil(right_value * 100 - wiggle) / 100.0;

    val0.textContent = left_value.toFixed(2)
    val1.textContent = right_value.toFixed(2);

    bar.style.top = (h / 8 + 1) + "px";
    inner_bar.style.top = (h / 3 + 1) + "px";

    left_knob.style.width = h+"px";
    left_knob.style.height = h+"px";
    left_knob.style.left = (w / (end - start) * (left_value - start) - h/2) + "px";

    right_knob.style.width = h+"px";
    right_knob.style.height = h+"px";
    right_knob.style.left = (w / (end - start) * (right_value - start) - h/2) + "px";

    inner_bar.style.left = (w / (end - start) * (left_value - start)) + "px";
    inner_bar.style.width = (w / (end - start) * (right_value - left_value)) + "px";
  }

  div.appendChild(left_knob);
  div.appendChild(right_knob);

  this.values = function() {
    return {start: parseFloat(left_value.toFixed(2)), end: parseFloat(right_value.toFixed(2))}
  }


  // ------ handle drag events ------
  var moving = null;
  var move_bar_start = null;
  var move_val_start = null;

  left_knob.addEventListener("mousedown", function() {
    moving = left_knob;
  }, false);

  right_knob.addEventListener("mousedown", function() {
    moving = right_knob;
  }, false);

  div.addEventListener("mouseup", function(e) {
    moving = null;
    this.resize();
  }.bind(this), false);

  div.addEventListener("mousemove", function(e) {
    if(moving != null) {
      var x = (e.clientX - div.offsetLeft);
      if(moving == left_knob) {
        left_value = start + Math.max(0, Math.min(x / w * (end - start), (end-start)/2));
        right_value = end - (left_value - start);
      } else if(moving == right_knob) {
        right_value = Math.min(end, Math.max(x / w * (end - start) + start, start+(end-start)/2));
        left_value = start + (end - right_value);
      }
      this.resize();
    }
  }.bind(this), false);


  var lo = document.createElement("span");
  lo.textContent = "0.0";
  lo.setAttribute("style", "float:left; position:relative; left:5px; font-size:10px; color:#FFFFFF");

  var val0 = document.createElement("span");
  val0.textContent = "0.25";
  val0.setAttribute("style", "font-size:10px; color:#FFFFFF; position:relative; top:-4px;");

  var val1 = document.createElement("span");
  val1.textContent = "0.75";
  val1.setAttribute("style", "font-size:10px; color:#FFFFFF; position:relative; top:-4px;");

  var hi = document.createElement("span");
  hi.textContent = "1.0";
  hi.setAttribute("style", "float:right; position:relative; right:5px; font-size:10px; color:#FFFFFF");

  left_knob.appendChild(val0);
  right_knob.appendChild(val1);

  bar.appendChild(lo);
  bar.appendChild(hi);


  this.resize();
}
