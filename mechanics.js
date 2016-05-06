// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function tableToArray(obj) {
  return ad2da(obj.selectAll("tr").data());
}

function ad2da(ad) {
  // array of dictionaries to dictionary of arrays
  da = {};
  // initialize dictionary of arrays
  for (var key in ad[0])
    da[key] = [];
  for (var i in ad) // for each element
    for (var key in ad[i]) // for each key
      da[key].push(Number(ad[i][key]))
  return da
}

function createBar(obj,data) {
  // obj should be a D3 object (not e.g. a jQuery object)
  var barWidth = 20,
    height = 210;

  // initialize chart size
  obj
    .attr("width", barWidth * data.length)
    .attr("height", height);

  // place bars and position horizontally
  var bar = obj.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  // apply remaining style
  styleBars(bar.append("rect"),bar.append("text"),d3.max(data),barWidth,height)
}

function updateBar(obj,data) {
  // obj should be a D3 object (not e.g. a jQuery object)
  var barWidth = obj.attr("width")/data.length,
    height = obj.attr("height");

  // bind new data
  var bar = obj.selectAll("g")
    .data(data);

  // apply style
  styleBars(bar.select("rect"),bar.select("text"),d3.max(data),barWidth,height)
}

function styleBars(rect,text,dataMax,barWidth,height) {

  // scales data to chart height
  var y = d3.scale.linear()
    .domain([0, dataMax])
    .range([height, 0]);

  // y position of numbers
  var yFcn = function(d,obj) {
    if (height-y(d)-5<obj.getBBox().width)
      return y(d)-5;
    else
      return y(d)+5;
    }

  // bar and text styling
  rect
    .attr("y", function(d) { return y(d); })
    .attr("width", barWidth - 1)
    .attr("height", function(d) { return height - y(d); });
  text
    .attr("x", barWidth / 2)
    .attr("y", function(d) { return yFcn(d, this); })
    .attr("dy", ".375em")
    .attr("transform", function(d){ return "rotate(90,{0},{1})".format(barWidth/2, yFcn(d, this)); })
    .text(function(d) { return d; });

  // over-bar numbers (for short bars)
  text
    .style("text-anchor",function(d) {
        if (height-y(d)-5<this.getBBox().width)
          return "end";
      })
    .style("fill",function(d) {
        if (height-y(d)-5<this.getBBox().width)
          return "steelblue";
      });
}

function showData(d, table) {
  var trs = table.selectAll("tr")
    .data(d);

  // add rows
  var bar = trs.enter().append("tr");

  // get keys
  var keys = d3.keys(d[0]);

  // populate elements
  for (iCol=0; iCol<keys.length; iCol++) {
    bar.append("td").html(function(d) { return d[keys[iCol]]; });
  }
}
