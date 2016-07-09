function BarChart() {
  this.init = function(x, data, parentNode) {
    var dataLims1 = [getMinOfArray(x), getMaxOfArray(x)];
    var xSpan = dataLims1[1] - dataLims1[0];
    var barWidth = xSpan/(x.length-1);
    this.xLims = [dataLims1[0]-barWidth/2, dataLims1[1]+barWidth/2];
    this.yLims = [0,getMaxOfArray(data)];
    this.axes = new Axes(parentNode, this.xLims, this.yLims);

    var height = 210;

    for (var i=0; i<data.length; i++) {
      if (isNaN(data[i]))
        continue

      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", "translate(" + this.axes.xScale(x[i]-barWidth/2) + "," + this.axes.yScale(data[i]) + ")")
      this.axes.svg.appendChild(g)
      var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      g.appendChild(rect)
      g.appendChild(text)
      var dataMax = getMaxOfArray(data);

      // bar and text styling
      //rect.setAttribute("y", this.axes.yScale(data[i]));
      rect.setAttribute("width", this.axes.xScale(barWidth) - this.axes.xScale(0) - 1);
      rect.setAttribute("height", this.axes.yScale(0)-this.axes.yScale(data[i]));
      rect.style.fill = "steelblue";

      text.innerHTML = data[i].toString();
      var xPos = this.axes.xScale(barWidth)-this.axes.xScale(barWidth/2);
      var yPos = 5;
      text.setAttribute("x", xPos+yPos); // this makes sense, I promise
      text.style.alignmentBaseline = "central";
      text.setAttribute("transform", "rotate(90,{0},{1})".format(xPos, 0));
      text.setAttribute("id", "boxSize "+i);

      // over-bar numbers (for short bars)
      if (rect.getAttribute("height")-yPos < text.getBBox().width) {
        text.style.textAnchor = "end";
        text.style.fill = "steelblue";
        text.setAttribute("x", text.getAttribute("x")-2*yPos);
      } else {
        text.style.fill = "white";
      }
    }
  }

  this.init.apply(this, arguments);
}
