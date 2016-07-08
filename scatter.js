function Scatter() {
  this.init = function(data, parentNode) {

    // get data
    var keys = Object.keys(data);
    var first_col = data[keys[0]];
    var second_col = data[keys[1]];

    // don't want dots overlapping axis, so add in buffer to data domain
    var dataLims1 = [getMinOfArray(first_col), getMaxOfArray(first_col)];
    var dataLims2 = [getMinOfArray(second_col), getMaxOfArray(second_col)];
    var xSpan = dataLims1[1] - dataLims1[0],
        ySpan = dataLims2[1] - dataLims2[0];
    this.xLims = [dataLims1[0]-xSpan*0.1, dataLims1[1]+xSpan*0.1];
    this.yLims = [dataLims2[0]-ySpan*0.1, dataLims2[1]+ySpan*0.1];
    this.axes = new Axes(parentNode[0][0], this.xLims, this.yLims);

    // draw dots
    for (var i=0; i<first_col.length; i++) {
      if (isNaN(first_col[i]) || isNaN(second_col[i]))
        continue
      var datum = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      datum.setAttribute("class", "dot");
      datum.setAttribute("r", 3.5);
      datum.setAttribute("cx", this.axes.xScale(first_col[i]));
      datum.setAttribute("cy", this.axes.yScale(second_col[i]));
      datum.style.fill = "steelblue";
      this.axes.svg.appendChild(datum);
    }

  }

  this.drawLine = function(fit) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1",this.axes.xScale(this.xLims[0]))
    line.setAttribute("x2",this.axes.xScale(this.xLims[1]))
    line.setAttribute("y1",this.axes.yScale(predict(this.xLims[0],fit)))
    line.setAttribute("y2",this.axes.yScale(predict(this.xLims[1],fit)))
    line.style.stroke = "rgb(100,100,100)";
    line.style.strokeWidth = 1;
    this.axes.svg.appendChild(line)
  }

  this.init.apply(this, arguments);
}
