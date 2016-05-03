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

function formToArray(obj) {
  var formOutput = $(obj).serializeArray();
  var data = new Array(formOutput.length);
  for (i=0; i<formOutput.length; i++) {
    data[i] = Number(formOutput[i].value);
  }
  return data;
}

function createBar(obj,data) {
  // obj should be a D3 object (not e.g. a jQuery object)
  console.log(data);
    
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
  console.log(data);
    
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

function loadCsv(filename,table) {
  d3.csv(filename,function(d){
    // place data in table
    
    var rows = table.selectAll("tr")
      .data(d);
      
    // replace existing rows
    var el = rows
      .select("td").select("input");
    console.log(el)
    console.log(d)
    el.attr("name",function(d) { return "val".concat(d.num); })
      .property("value",function(d) { return d.num; });
  
    // add new rows
    var bar = rows.enter().append("tr");
      
    bar.append("td").append("input")
      .attr("type","text")
      .attr("name",function(d) { return "val".concat(d.num); })
      .attr("value",function(d) { return d.num; });
    
    // remove extra rows
    rows
      .exit().remove();
  });
  return data;
}