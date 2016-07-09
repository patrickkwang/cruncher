function Axes() {
  this.init = function(parentNode, xLims, yLims) {
    this.margin = {top: 20, right: 20, bottom: 40, left: 40},
    this.width = 500,
    this.height = 500;
    this.xLims = xLims;
    this.yLims = yLims;

    // auto-generate tick labels if they are not provided
    var xOrder = Math.ceil(Math.log10(xLims[1]-xLims[0]))-1;
    var yOrder = Math.ceil(Math.log10(yLims[1]-yLims[0]))-1;
    var xTickSpan = Math.pow(10, xOrder);
    var yTickSpan = Math.pow(10, yOrder);
    var xTicks = stepToVec(ceilBy(xLims[0],xTickSpan),floorBy(xLims[1],xTickSpan),xTickSpan);
    var yTicks = stepToVec(ceilBy(yLims[0],yTickSpan),floorBy(yLims[1],yTickSpan),yTickSpan);
    var xTickLabels = xTicks.map(function(a) {
      if (xOrder<0)
        a = a.toFixed(-xOrder);
      return a;
    });
    var yTickLabels = yTicks.map(function(a) {
      if (yOrder<0)
        a = a.toFixed(-yOrder);
      return a;
    });

    // add the graph canvas to the body of the webpage
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", this.width + this.margin.left + this.margin.right)
    this.svg.setAttribute("height", this.height + this.margin.top + this.margin.bottom)
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.svg.appendChild(g);
    var xg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    xg.style.zIndex = 1;
    var yg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    yg.style.zIndex = 1;
    g.appendChild(xg);
    g.appendChild(yg);
    var cg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    cg.style.zIndex = -1;
    g.appendChild(cg);

    var scaleFcn = function(domain, range) {
      return function(x) {
        return (x-domain[0])/(domain[1]-domain[0])*range[1] + (domain[1]-x)/(domain[1]-domain[0])*range[0];
      };
    }

    this.xScale = scaleFcn(this.xLims, [0, this.width]);
    this.yScale = scaleFcn(this.yLims, [this.height, 0]);

    var xAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxisLine.setAttribute("x1",this.xScale(this.xLims[0]));
    xAxisLine.setAttribute("x2",this.xScale(this.xLims[1]));
    xAxisLine.setAttribute("y1",this.yScale(this.yLims[0]));
    xAxisLine.setAttribute("y2",this.yScale(this.yLims[0]));
    xAxisLine.style.stroke = "rgb(0,0,0)";
    xAxisLine.style.strokeWidth = 3;
    xAxisLine.style.strokeLinecap = "square";
    xg.appendChild(xAxisLine)
    var xAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xAxisLabel.setAttribute("x", this.xScale(this.xLims[1]));
    xAxisLabel.setAttribute("y", this.yScale(this.yLims[0])-5);
    xAxisLabel.style.textAnchor = "end";
    xAxisLabel.style.alignmentBaseline = "baseline";
    xAxisLabel.innerHTML = "x-label";
    xg.appendChild(xAxisLabel);

    var yAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxisLine.setAttribute("x1", this.xScale(this.xLims[0]));
    yAxisLine.setAttribute("x2", this.xScale(this.xLims[0]));
    yAxisLine.setAttribute("y1", this.yScale(this.yLims[0]));
    yAxisLine.setAttribute("y2", this.yScale(this.yLims[1]));
    yAxisLine.style.stroke = "rgb(0,0,0)";
    yAxisLine.style.strokeWidth = 3;
    yAxisLine.style.strokeLinecap = "square";
    yg.appendChild(yAxisLine)
    var yAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yAxisLabel.setAttribute("x", this.xScale(this.xLims[0]));
    yAxisLabel.setAttribute("y", this.yScale(this.yLims[1])+5);
    yAxisLabel.setAttribute("transform", "rotate(-90, 0, 0)");
    yAxisLabel.style.textAnchor = "end";
    yAxisLabel.style.alignmentBaseline = "hanging";
    yAxisLabel.innerHTML = "y-label";
    yg.appendChild(yAxisLabel);

    for (var i=0; i<xTicks.length; i++) {
      var tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tickLine.setAttribute("x1",this.xScale(xTicks[i]));
      tickLine.setAttribute("x2",this.xScale(xTicks[i]));
      tickLine.setAttribute("y1",this.yScale(this.yLims[0]));
      tickLine.setAttribute("y2",this.yScale(this.yLims[0])+5);
      tickLine.style.stroke = "rgb(0,0,0)";
      tickLine.style.strokeWidth = 3;
      tickLine.style.strokeLinecap = "square";
      xg.appendChild(tickLine)
      var tickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      tickLabel.setAttribute("x",this.xScale(xTicks[i]));
      tickLabel.setAttribute("y",this.yScale(this.yLims[0])+10);
      tickLabel.style.textAnchor = "middle";
      tickLabel.style.alignmentBaseline = "hanging";
      tickLabel.innerHTML = xTickLabels[i];
      xg.appendChild(tickLabel)
    }

    for (var i=0; i<yTicks.length; i++) {
      var tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tickLine.setAttribute("x1",this.xScale(this.xLims[0]));
      tickLine.setAttribute("x2",this.xScale(this.xLims[0])-5);
      tickLine.setAttribute("y1",this.yScale(yTicks[i]));
      tickLine.setAttribute("y2",this.yScale(yTicks[i]));
      tickLine.style.stroke = "rgb(0,0,0)";
      tickLine.style.strokeWidth = 3;
      tickLine.style.strokeLinecap = "square";
      yg.appendChild(tickLine)
      var tickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      tickLabel.setAttribute("x",this.xScale(this.xLims[0])-10);
      tickLabel.setAttribute("y",this.yScale(yTicks[i]));
      tickLabel.style.textAnchor = "end";
      tickLabel.style.alignmentBaseline = "central";
      tickLabel.innerHTML = yTickLabels[i];
      yg.appendChild(tickLabel)
    }

    parentNode.appendChild(this.svg);
    this.svg = cg;
  }

  this.init.apply(this, arguments);
}

function stepToVec(a, b, step) {
  var nSteps = Math.floor((b-a)/step)+1;
  var vec = new Array(nSteps);
  for (var i=0; i<nSteps; i++) {
    vec[i] = a+i*step;
  }
  return vec;
}
