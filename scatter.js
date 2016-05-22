function Scatter() {
  this.init = function(data) {
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
    var keys = d3.keys(data[0]);

    // setup x
    var that = this;
    this.xValue = function(d) { return d[keys[0]];}; // data -> value
    this.xScale = d3.scale.linear().range([0, this.width]); // value -> display
    this.xMap = function(d) { return that.xScale(that.xValue(d));}; // data -> display
    this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");

    // setup y
    this.yValue = function(d) { return d[keys[1]];}; // data -> value
    this.yScale = d3.scale.linear().range([this.height, 0]); // value -> display
    this.yMap = function(d) { return that.yScale(that.yValue(d));}; // data -> display
    this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");

    // setup fill color
    var cValue = function(d) { return d[keys[1]];},
        color = d3.scale.category10();

    // add the graph canvas to the body of the webpage
    this.svg = d3.select("body").append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // change string (from CSV) into number format
    data.forEach(function(d) {
      for (var i=0; i<keys.length; i++)
        d[keys[i]] = +d[keys[i]];
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    var xSpan = d3.max(data, this.xValue) - d3.min(data, this.xValue),
        ySpan = d3.max(data, this.yValue) - d3.min(data, this.yValue);
    this.xScale.domain([d3.min(data, this.xValue)-xSpan/10, d3.max(data, this.xValue)+xSpan/10]);
    this.yScale.domain([d3.min(data, this.yValue)-ySpan/10, d3.max(data, this.yValue)+ySpan/10]);

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
    this.svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", this.xMap)
        .attr("cy", this.yMap)
        .style("fill", function(d) { return color(0);}) //cValue(d)
  }

  this.init.apply(this, arguments);
}
