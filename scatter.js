function Scatter() {
  this.init = function(data, parentNode) {
    this.margin = {top: 20, right: 20, bottom: 30, left: 40},
    this.width = 600 - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    /*
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */

    // get axis labels
    var keys = Object.keys(data);
    var first_col = data[keys[0]];
    var second_col = data[keys[1]];

    // setup x
    var that = this;
    this.xValue = function(d) { return d[keys[0]];}; // data -> value
    this.xScale = d3.scale.linear().range([0, this.width]); // value -> display
    this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");

    // setup y
    this.yValue = function(d) { return d[keys[1]];}; // data -> value
    this.yScale = d3.scale.linear().range([this.height, 0]); // value -> display
    this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");

    // setup fill color
    var color = d3.scale.category10();

    // add the graph canvas to the body of the webpage
    this.svg = parentNode.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // don't want dots overlapping axis, so add in buffer to data domain
    var xSpan = getMaxOfArray(first_col) - getMinOfArray(first_col),
        ySpan = getMaxOfArray(second_col) - getMinOfArray(second_col);
    this.xScale.domain([getMinOfArray(first_col)-xSpan/10, getMaxOfArray(first_col)+xSpan/10]);
    this.yScale.domain([getMinOfArray(second_col)-ySpan/10, getMaxOfArray(second_col)+ySpan/10]);

    // x-axis
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", this.width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(keys[0]);

    // y-axis
    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(keys[1]);

    // draw dots
    for (var i=0; i<first_col.length; i++) {
      if (isNaN(first_col[i]) || isNaN(second_col[i]))
        continue
      this.svg.append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", this.xScale(first_col[i]))
          .attr("cy", this.yScale(second_col[i]))
          .style("fill", function(d) { return color(0);}) //cValue(d)
    }
    /*this.svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", this.xMap)
        .attr("cy", this.yMap)
        .style("fill", function(d) { return color(0);}) //cValue(d)*/
  }

  this.drawLine = function(fit) {
    // fit is a 2-element array [b, m]
    var xLims = this.xScale.domain();
    this.svg.append("line")
      .attr("x1",this.xScale(xLims[0]))
      .attr("x2",this.xScale(xLims[1]))
      .attr("y1",this.yScale(predict(xLims[0],fit)))
      .attr("y2",this.yScale(predict(xLims[1],fit)))
      .style("stroke","rgb(100,100,100)")
      .style("stroke-width",1)
  }

  this.init.apply(this, arguments);
}
