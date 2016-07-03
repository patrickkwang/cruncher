function BarChart() {
  this.init = function(data, parentNode) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "chart");
    parentNode.appendChild(svg);

    var barWidth = 20,
      height = 210;

    this.chart = svg;
    svg.setAttribute("width", barWidth * data.length);
    svg.setAttribute("height", height);

    for (var i=0; i<data.length; i++) {
      if (isNaN(data[i]))
        continue

      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", "translate(" + i * barWidth + ",0)")
      svg.appendChild(g)
      var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      g.appendChild(rect)
      g.appendChild(text)
      this.styleBar(rect, text, getMaxOfArray(data), barWidth, height, data[i], i);
    }
  }

  this.styleBar = function(rect, text, dataMax, barWidth, height, d, i) {
    // scales data to chart height
    var y = function(x) {
      // maps x from the domain [0, dataMax] to the range [height, 0]
      return (x-0)/(dataMax-0)*0 + (dataMax-x)/(dataMax-0)*height;
    }

    // y position of numbers
    var yFcn = function(d, obj) {
      if (height-y(d)-5 < obj.getBBox().width)
        return y(d)-5;
      else
        return y(d)+5;
    }

    // bar and text styling
    rect.setAttribute("y", y(d));
    rect.setAttribute("width", barWidth - 1);
    rect.setAttribute("height", height - y(d));

    text.innerHTML = d.toString();
    text.setAttribute("x", barWidth / 2);
    text.setAttribute("y", yFcn(d, text));
    text.setAttribute("dy", ".375em");
    text.setAttribute("transform", "rotate(90,{0},{1})".format(barWidth/2, yFcn(d, text)));
    text.setAttribute("id", "boxSize "+i);

    // over-bar numbers (for short bars)
    if (height-y(d)-5 < text.getBBox().width) {
      text.style.textAnchor = "end";
      text.style.fill = "steelblue";
    }
  }

  this.init.apply(this, arguments);
}
