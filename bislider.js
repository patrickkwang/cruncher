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
  bar.style.cursor = "pointer";
  bar.style.height = "75%";
  bar.style.display = "block";
  bar.style.position = "absolute";
  bar.style.backgroundColor = "#BBBBBB";

  var inner_bar = document.createElement("div");
  div.appendChild(inner_bar);
  inner_bar.style.height = "33%";
  inner_bar.style.cursor = "pointer";
  inner_bar.style.display = "block";
  inner_bar.style.position = "absolute";
  inner_bar.style.backgroundColor = "#DDDDDD";

  var start = st;
  var end = en;

  var value = val;
  if(val == null) {
    value = 10;
  }

  var end_value = end - (value - start);

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
    bar.style.top = (h / 8 + 1) + "px";
    inner_bar.style.top = (h / 3 + 1) + "px";

    left_knob.style.width = h+"px";
    left_knob.style.height = h+"px";
    left_knob.style.left = (w / (end - start) * (value - start) - h/2) + "px";

    right_knob.style.width = h+"px";
    right_knob.style.height = h+"px";
    right_knob.style.left = (w / (end - start) * (end_value - start) - h/2) + "px";

    inner_bar.style.left = (w / (end - start) * (value - start)) + "px";
    inner_bar.style.width = (w / (end - start) * (end_value - value)) + "px";
  }

  div.appendChild(left_knob);
  div.appendChild(right_knob);

  this.values = function() {
    return {start: value, end: end_value}
  }

  this.resize();


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

  inner_bar.addEventListener("mousedown", function(e) {
    moving = inner_bar;
    move_bar_start = (e.clientX - inner_bar.offsetLeft);
    move_val_start = value;
  }, false);

  div.addEventListener("mouseup", function(e) {
    console.log("up");
    moving = null;
    this.resize();
  }.bind(this), false);

  div.addEventListener("mousemove", function(e) {
    if(moving != null) {
      var x = e.clientX - div.offsetLeft;
      console.log("move", x);
      if(moving == left_knob) {
        value = (x / w * (end - start) + start);
      } else if(moving == right_knob) {
        end_value = (x / w * (end - start) + start);
      } else if(moving == inner_bar) {
        var diff = end_value - value;
        value = ((x - move_bar_start) / w * (end - start) + move_val_start);
        end_value = value + diff;
      }
      this.resize();
    }
  }.bind(this), false);
}
