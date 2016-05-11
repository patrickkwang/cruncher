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

function tableToDict(obj) {
  return ad2da(obj.selectAll("tr").data());
}

function tableToArray(obj) {
  var dictOfArrays = tableToDict(obj);
  var keys = d3.keys(dictOfArrays);
  if (keys.length==1)
    return dictOfArrays[keys[0]];
  else
    throw "not yet implemented";
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
    console.log(obj)
    if (height-y(d)-5<0)//obj.getBBox().width)
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
        if (height-y(d)-5<0)//this.getBBox().width)
          return "end";
      })
    .style("fill",function(d) {
        if (height-y(d)-5<0)//this.getBBox().width)
          return "steelblue";
      });
}

function createDataset(d, fname) {
  var name = fname.substring(0, fname.lastIndexOf('.')).toLowerCase();

  // first, make the table
  var dataset = document.createElement("div");
  var id = "csvdata_" + name;
  dataset.setAttribute("id", id);
  dataset.setAttribute("class", "dataset");
  var title = document.createElement("div");
  title.setAttribute("class", "dataset_title");
  title.textContent = fname;
  dataset.appendChild(title);
  document.body.appendChild(dataset);
  var table = document.createElement("table");
  dataset.appendChild(table);
  var d3_dataset = d3.select("#" + id);
  var d3_table = d3_dataset.select("table");

  var trs = d3_table.selectAll("tr")
    .data(d);

  // add rows
  var bar = trs.enter().append("tr");

  // populate elements
  for (key in d[0]) {
    bar.append("td").html(function(d) { return d[key]; });
  }

  // create statistics elements
  var stats_elem = document.createElement("span");
  stats_elem.setAttribute("class", "agg_stats");

  var icdf_input = document.createElement("input");
  var icdf_btn = document.createElement("button");
  icdf_btn.setAttribute("type", "button");
  icdf_btn.setAttribute("class", "sample1");
  icdf_btn.textContent = "iCDF";

  var sample1_btn = document.createElement("button");
  sample1_btn.setAttribute("type", "button");
  sample1_btn.setAttribute("class", "sample1");
  sample1_btn.textContent = "Sample!";

  var sample10_btn = document.createElement("button");
  sample10_btn.setAttribute("type", "button");
  sample10_btn.setAttribute("class", "sample10");
  sample10_btn.textContent = "Sample 10!";

  var sample100_btn = document.createElement("button");
  sample100_btn.setAttribute("type", "button");
  sample100_btn.setAttribute("class", "sample100");
  sample100_btn.textContent = "Sample 100!";

  var svg = document.createElement("svg");
  svg.setAttribute("class", "chart");

  dataset.appendChild(document.createTextNode("Aggregate stats: "));
  dataset.appendChild(document.createElement("br"));
  dataset.appendChild(stats_elem);
  dataset.appendChild(document.createElement("br"));
  dataset.appendChild(document.createElement("br"));
  dataset.appendChild(icdf_input);
  dataset.appendChild(icdf_btn);
  dataset.appendChild(document.createElement("br"));
  dataset.appendChild(document.createElement("br"));
  dataset.appendChild(sample1_btn);
  dataset.appendChild(sample10_btn);
  dataset.appendChild(sample100_btn);
  dataset.appendChild(document.createElement("br"));
  dataset.appendChild(document.createElement("br"));
  dataset.appendChild(svg);


  // ------ set up button callbacks ------

  // callback for recomputing data statistics
  $(table).change(function(){
    var data = tableToArray(d3_table);
    $(".mean").text(mean(data).toString());
    $(".stdv").text(stdv(data).toString());
    //updateBar(d3.select(".chart"),data);
  });

  // callback for iCDF
  $(icdf_btn).click(function(){
    var data = tableToArray(d3_table);
    var val = icdf_input.value;
    console.log(icdf(data,val))
    return false;
  });

  // initialize data statistics
  var data = tableToDict(d3_table);
  var agg_stats = $("#" + id + " .agg_stats").get(0);
  for(col in data) {
    agg_stats.appendChild(document.createTextNode(col + ": \u03bc" + mean(data[col]).toString() + " \u03c3" + stdv(data[col]).toString()));
    agg_stats.appendChild(document.createElement("br"));
  }
  data = tableToArray(d3_table);
  var meanSamples = [mean(data)]
  var edges = [0.5,1.5,2.5,3.5,4.5,5.5];
  var d3_chart = d3_dataset.select(".chart");

  console.log(histogram(meanSamples, edges))
  console.log(d3_chart, meanSamples, edges);

  // callback for sample1
  $(sample1_btn).click(function(){
    var data = tableToArray(d3_table);
    //var keys = d3.keys(data);
    //data = data[keys[0]];
    meanSamples.push(mean(bootstrap(data,data.length)));
    updateBar(d3_chart, histogram(meanSamples, edges))
  });

  // callback for sample10
  $(sample10_btn).click(function(){
    var data = tableToArray(d3_table);
    //var keys = d3.keys(data);
    //data = data[keys[0]];
    for (iSample=0; iSample<10; iSample++)
      meanSamples.push(mean(bootstrap(data,data.length)));
    updateBar(d3_chart, histogram(meanSamples, edges))
  });

  // callback for sample100
  $(sample100_btn).click(function(){
    console.log("hello world")
    var data = tableToArray(d3_table);
    //var keys = d3.keys(data);
    //data = data[keys[0]];
    for (iSample=0; iSample<100; iSample++)
      meanSamples.push(mean(bootstrap(data,data.length)));
    updateBar(d3_chart, histogram(meanSamples, edges))
  });
  createBar(d3_chart, histogram(meanSamples, edges));

}
