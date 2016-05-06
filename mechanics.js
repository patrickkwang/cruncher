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

  var y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

  var chart = obj
    .attr("width", barWidth * data.length)
    .attr("height", height);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
    .attr("y", function(d) { return y(d); })
    .attr("width", barWidth - 1)
    .attr("height", function(d) { return height - y(d); });

  yFcn = function(d,obj) {
    if (height-y(d)-5<obj.getBBox().width)
      return y(d)-5;
    else
      return y(d)+5;
  }

  bar.append("text")
    .attr("x", barWidth / 2)
    .attr("y", function(d) { return yFcn(d, this); })
    .attr("dy", ".375em")
    .attr("transform", function(d){ return "rotate(90,{0},{1})".format(barWidth/2, yFcn(d, this)); })
    .text(function(d) { return d; });
}

function updateBar(obj,data) {
  // obj should be a D3 object (not e.g. a jQuery object)

  var barWidth = 20,
    height = 210;

  var y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

  var chart = obj;

  var bar = chart.selectAll("g")
    .data(data);

  bar.select("rect")
    .attr("y", function(d) { return y(d); })
    .attr("width", barWidth - 1)
    .attr("height", function(d) { return height - y(d); });

  yFcn = function(d,obj) {
    if (height-y(d)-5<obj.getBBox().width)
      return y(d)-5;
    else
      return y(d)+5;
  }

  var num = bar.select("text")
    .attr("x", barWidth / 2)
    .attr("y", function(d) { return yFcn(d, this); })
    .attr("dy", ".375em")
    .attr("transform", function(d){ return "rotate(90,{0},{1})".format(barWidth/2, yFcn(d, this)); })
    .text(function(d) { return d; });

  num.style("text-anchor",function(d) {
    if (height-y(d)-5<this.getBBox().width)
      return "end";
  });
  num.style("fill",function(d) {
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
    bar.append("td").append("input")
      .attr("type","text")
      .attr("name",function(d) { return "val".concat(d[keys[iCol]]); })
      .attr("value",function(d) { return d[keys[iCol]]; });
  }
}
