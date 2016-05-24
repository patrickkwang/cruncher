function DataTable() {
  this.init = function(parent_node, data) {

    // container to control scrolling, sizing, and such
    var table_div = document.createElement("div");
    table_div.setAttribute("class", "table-container");
    parent_node.appendChild(table_div);

    // data table
    var table = document.createElement("table");
    table.setAttribute("class", "data-table");
    table.setAttribute("cellpadding", "0");
    table.setAttribute("cellspacing", "0");
    table_div.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);
    var hrow = document.createElement("tr");
    thead.appendChild(hrow);
    var keys = Object.keys(data);

    for(var i = 0; i < keys.length; i++) {
      var th = document.createElement("th");
      th.textContent = keys[i];
      th.setAttribute("class", "data-table-header-cell");
      hrow.appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for(var j = 0; j < data[keys[0]].length; j++) {
      var tr = document.createElement("tr");
      tbody.appendChild(tr);
      for(var i = 0; i < keys.length; i++) {
        var td = document.createElement("td");
        tr.appendChild(td);
        td.setAttribute("class", "data-table-cell");
        td.textContent = data[keys[i]][j];
      }
    }
  }

  this.init.apply(this, arguments);
}


function Dataset() {
  this.init = function(id, fname, csv_data, parent_node) {

    // first, make the dataset block
    this.root_node = document.createElement("div");
    this.root_node.setAttribute("id", id);
    this.root_node.setAttribute("class", "sheet");
    parent_node.appendChild(this.root_node);

    this.tab = document.createElement("div");
    this.tab.setAttribute("class", "tab");
    this.tab.textContent = fname;
    this.tab.addEventListener("click", function() {
      load_tab(this, id);
    }, false);

    document.getElementById("tabs").appendChild(document.createTextNode(" ")); // put a little space between tabs
    document.getElementById("tabs").appendChild(this.tab);

    // delete button
    var del = document.createElement("button");
    del.setAttribute("class", "dataset_delete");
    del.setAttribute("type", "button");
    del.setAttribute("style", "float:right");
    del.textContent = "x";
    this.root_node.appendChild(del);

    // internal data structure
    this.data = this.rowmajor2colmajor(csv_data);
    this.columns = Object.keys(this.data);
    this.first_col = this.data[this.columns[0]];

    this.data_table = new DataTable(this.root_node, this.data);

    // create statistics elements
    var stats_elem = document.createElement("span");
    stats_elem.setAttribute("class", "agg_stats");

    var icdf_input = document.createElement("input");
    var icdf_btn = document.createElement("button");
    icdf_btn.setAttribute("type", "button");
    icdf_btn.textContent = "iCDF";

    if (this.columns.length>1) {
      var fit_btn = document.createElement("button");
      fit_btn.setAttribute("type", "button");
      fit_btn.textContent = "Fit!";
    }

    var sample1_btn = document.createElement("button");
    sample1_btn.setAttribute("type", "button");
    sample1_btn.textContent = "Sample!";

    var sample10_btn = document.createElement("button");
    sample10_btn.setAttribute("type", "button");
    sample10_btn.textContent = "Sample 10!";

    var sample100_btn = document.createElement("button");
    sample100_btn.setAttribute("type", "button");
    sample100_btn.textContent = "Sample 100!";

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "chart");

    this.root_node.appendChild(document.createTextNode("Aggregate stats: "));
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(stats_elem);
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(icdf_input);
    this.root_node.appendChild(icdf_btn);
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(document.createElement("br"));
    if (this.columns.length>1) {
      this.root_node.appendChild(fit_btn);
      this.root_node.appendChild(document.createElement("br"));
      this.root_node.appendChild(document.createElement("br"));
    }
    this.root_node.appendChild(sample1_btn);
    this.root_node.appendChild(sample10_btn);
    this.root_node.appendChild(sample100_btn);
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(svg);

    // initialize data statistics
    var agg_stats = $("#" + id + " .agg_stats").get(0);
    for(col in this.data) {
      agg_stats.appendChild(document.createTextNode(col + ": \u03bc" + mean(this.data[col]).toString() + " \u03c3" + stdv(this.data[col]).toString()));
      agg_stats.appendChild(document.createElement("br"));
    }

    // scatter plot
    if (this.columns.length>1) {
      this.second_col = this.data[this.columns[1]];
      var scatter = new Scatter(this.data, d3.select(this.root_node));
    }

    // initialize chart and mean histogram
    this.chart = d3_dataset.select(".chart");
    this.meanSamples = [];
    this.edges = [0.5,1.5,2.5,3.5,4.5,5.5];
    this.createBar();

    // ------ set up button callbacks ------ //

    // callback for delete button
    del.addEventListener("click", function(){
      parent_node.removeChild(this.root_node)
      document.getElementById("tabs").removeChild(this.tab); // and get rid of tab
      console.log("deleted.")
      return false;
    }.bind(this), false);

    // callback for iCDF
    $(icdf_btn).click(function(){
      var val = icdf_input.value;
      console.log(icdf(this.first_col, val))
      return false;
    }.bind(this));

    // callback for linear fit
    if (this.columns.length>1) {
      $(fit_btn).click(function(){
        var fit = linearFit(this.first_col, this.second_col);
        console.log("y = {1}x + {0}".format(fit[0],fit[1]))
        console.log("rmse: {0}".format(rmse(this.first_col, this.second_col, fit)))
        console.log("r2: {0}".format(r2(this.first_col, this.second_col, fit)))
        scatter.drawLine(fit)
        return false;
      }.bind(this));
    }

    // callback for sample1
    $(sample1_btn).click(function(){
      this.sampleMean();
      this.updateBar()
    }.bind(this));

    // callback for sample10
    $(sample10_btn).click(function(){
      for (var iSample=0; iSample<10; iSample++)
        this.sampleMean();
      this.updateBar()
    }.bind(this));

    // callback for sample100
    $(sample100_btn).click(function(){
      for (var iSample=0; iSample<100; iSample++)
        this.sampleMean();
      this.updateBar();
    }.bind(this));
  }

  this.sampleMean = function() {
    this.meanSamples.push(mean(bootstrap(this.first_col, this.first_col.length)));
  }

  this.rowmajor2colmajor = function(ad) {
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

  this.createBar = function() {
    var hist_data = histogram(this.meanSamples, this.edges);

    var barWidth = 20,
      height = 210;

    // initialize chart size
    this.chart
      .attr("width", barWidth * hist_data.length)
      .attr("height", height);

    // place bars and position horizontally
    var bar = this.chart.selectAll("g")
      .data(hist_data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

    // apply remaining style
    this.styleBars(bar.append("rect"), bar.append("text"), d3.max(hist_data), barWidth, height)
  }

  this.updateBar = function() {
    var hist_data = histogram(this.meanSamples, this.edges)

    var barWidth = this.chart.attr("width") / hist_data.length,
      height = this.chart.attr("height");

    // bind new data
    var bar = this.chart.selectAll("g").data(hist_data);

    // apply style
    this.styleBars(bar.select("rect"), bar.select("text"), d3.max(hist_data), barWidth, height);
  }

  this.styleBars = function(rect, text, dataMax, barWidth, height) {
    // scales data to chart height
    var y = d3.scale.linear()
      .domain([0, dataMax])
      .range([height, 0]);

    // y position of numbers
    var yFcn = function(d, obj) {
      if (height-y(d)-5 < obj.getBBox().width)
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
          if (height-y(d)-5 < this.getBBox().width)
            return "end";
        })
      .style("fill",function(d) {
          if (height-y(d)-5 < this.getBBox().width)
            return "steelblue";
        });
  }

  this.init.apply(this, arguments);
}
