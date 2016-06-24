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
  this.init = function(id, fname, csv_data, parent_node, genFcn) {

    this.name = id;
    this.load_data(csv_data);
    this.genFcn = genFcn;

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

    // activate it immediately - incidentally, this will fix the BBox issues
    load_tab(this.tab, id);

    // delete button
    var del = document.createElement("button");
    del.setAttribute("class", "dataset_delete");
    del.setAttribute("type", "button");
    del.setAttribute("style", "float:right");
    del.textContent = "x";
    this.root_node.appendChild(del);

    // internal data structure
    this.columns = Object.keys(this.data);
    this.first_col = this.data[this.columns[0]];
    this.data_table = new DataTable(this.root_node, this.data);

    // selectors for multi-dataset analysis
    for(var s = 0; s < 2; s++) {
      var series = document.getElementById("dataSeries" + s);
      for(var i = 0; i < this.columns.length; i++) {
        var option = document.createElement("option");
        var col_id = this.name + "/" + this.columns[i];
        option.textContent = col_id;
        option.setAttribute("value", col_id);
        option.setAttribute("class", col_id);
        series.appendChild(option);
      }
    }

    // create statistics elements
    var stats_elem = document.createElement("span");
    stats_elem.setAttribute("class", "agg_stats");

    /*
    var icdf_input = document.createElement("input");
    icdf_input.setAttribute("type", "range");
    icdf_input.setAttribute("min", 0.0);
    icdf_input.setAttribute("value", 0.5);
    icdf_input.setAttribute("max", 1.0);
    icdf_input.setAttribute("step", 0.01);
    icdf_input.setAttribute("style", "width:200px; margin-right:20px");
    */
    var icdf_input = new Slider(0.0, 1.0, 0.2);
    icdf_input.width(200);
    icdf_input.height(20);
    icdf_input.node().style.marginRight = "20px";

    var icdf_range_labels = document.createElement("div");
    icdf_range_labels.setAttribute("style", "width:200px; display:inline-block");
    var icdf_lo = document.createElement("span");
    icdf_lo.textContent = "0.0";
    icdf_lo.setAttribute("style", "float:left; position:relative; left:-10px");
    var icdf_hi = document.createElement("span");
    icdf_hi.textContent = "1.0";
    icdf_hi.setAttribute("style", "float:right; position:relative; right:-10px");
    icdf_range_labels.appendChild(icdf_lo);
    icdf_range_labels.appendChild(icdf_hi);
    var icdf_btn = document.createElement("button");
    icdf_btn.setAttribute("type", "button");
    icdf_btn.textContent = "iCDF";

    if (this.columns.length>1) {
      var fit_btn = document.createElement("button");
      fit_btn.setAttribute("type", "button");
      fit_btn.textContent = "Fit!";
    }

    if (this.genFcn != null) {
      var sample_btn = document.createElement("button");
      sample_btn.setAttribute("type", "button");
      sample_btn.textContent = "Get more data";
    }

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "chart");

    this.root_node.appendChild(document.createTextNode("Aggregate stats: "));
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(stats_elem);
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(icdf_input.node());
    this.root_node.appendChild(icdf_btn);
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(icdf_range_labels);
    this.root_node.appendChild(document.createElement("br"));
    this.root_node.appendChild(document.createElement("br"));
    if (this.columns.length>1) {
      this.root_node.appendChild(fit_btn);
      this.root_node.appendChild(document.createElement("br"));
      this.root_node.appendChild(document.createElement("br"));
    }
    if (this.genFcn != null) {
      this.root_node.appendChild(sample_btn);
      this.root_node.appendChild(document.createElement("br"));
      this.root_node.appendChild(document.createElement("br"));
    }

    // initialize data statistics
    for(col in this.data) {
      stats_elem.appendChild(document.createTextNode(col + ": \u03bc" + mean(this.data[col]).toString() + " \u03c3" + stdv(this.data[col]).toString()));
      stats_elem.appendChild(document.createElement("br"));
    }

    // scatter plot/histogram
    if (this.columns.length>1) {
      this.second_col = this.data[this.columns[1]];
      var scatter = new Scatter(this.data, d3.select(this.root_node));
    } else {
      this.root_node.appendChild(svg);
      // initialize chart and mean histogram
      this.chart = d3.select(svg);
      var arMax = getMaxOfArray(this.first_col);
      var arMin = getMinOfArray(this.first_col);
      var nBins = 5;
      var arSpan = arMax-arMin;
      var binSz = arSpan/(nBins-1);
      this.edges = new Array(nBins+1);
      for (var i=0; i<nBins+1; i++)
        this.edges[i] = arMin - binSz/2 + i*binSz;
      this.createBar();
    }

    // ------ set up button callbacks ------ //

    // callback for delete button
    del.addEventListener("click", function(){
      parent_node.removeChild(this.root_node)
      document.getElementById("tabs").removeChild(this.tab); // and get rid of tab

      // selectors for multi-dataset analysis
      for (var i = 0; i < this.columns.length; i++) {
        var col_id = this.name + "/" + this.columns[i];
        var options = document.getElementsByClassName(col_id);
        for (var j = options.length-1; j>-1; j--) {
          options[j].parentNode.removeChild(options[j]);
        }
      }

      console.log("deleted.")

      current_sheet = document.getElementById("sheet1");
      current_sheet.style.display = "block";
      current_tab = document.getElementById("tab1");
      current_tab.style.borderBottom = "1px solid #FFFFFF";

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

    if (this.genFcn != null) {
      $(sample_btn).click(function(){
        console.log(this.genFcn())
      }.bind(this));
    }
  }

  this.sampleMean = function() {
    this.meanSamples.push(mean(bootstrap(this.first_col, this.first_col.length)));
  }

  this.load_data = function(csv_data) {
    var header;
    if(isNaN(parseInt(csv_data[0][0]))) {
      // header is present, maybe
      header = csv_data.splice(0, 1)[0]; // remove first row
    } else {
      header = [];
      for(var i = 1; i <= csv_data[0].length; i++) {
        header.push("col"+i);
      }
    }

    this.data = {};
    // initialize dictionary of arrays
    for (var j = 0; j < header.length; j++) {
      this.data[header[j]] = [];
    }
    var nans = 0;
    for (var i = 0; i < csv_data.length; i++) {
      for (var j = 0; j < csv_data[i].length; j++) {
        if(typeof(csv_data[i][j])=='number') {
          this.data[header[j]].push(csv_data[i][j]);
        } else if(csv_data[i][j].trim().length == 0) {
          this.data[header[j]].push(NaN);
          nans++;
        } else {
          this.data[header[j]].push(Number(csv_data[i][j]));
          if (isNaN(this.data[header[j]][i])) {
            nans++;
          }
        }
      }
    }
    if(nans > 0) {
      console.error(nans + " values were not numeric, now they are NaN.");
    }
  }

  this.createBar = function() {
    var hist_data = histogram(this.first_col, this.edges);

    var barWidth = 20,
      height = 210;

    // initialize chart size
    this.chart
      .attr("width", barWidth * hist_data.length)
      .attr("height", height);


    for (var i=0; i<hist_data.length; i++) {
      if (isNaN(hist_data[i]))
        continue
      var g = this.chart.append("g");
      g.attr("transform", "translate(" + i * barWidth + ",0)");
      this.styleBar(g.append("rect"), g.append("text"), getMaxOfArray(hist_data), barWidth, height, hist_data[i], i);
    }

    /*
    // place bars and position horizontally
    var bar = this.chart.selectAll("g") h
      .data(hist_data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

    // apply remaining style
    this.styleBars(bar.append("rect"), bar.append("text"), getMaxOfArray(hist_data), barWidth, height)
    */
  }

  this.styleBar = function(rect, text, dataMax, barWidth, height, d, i) {
    // scales data to chart height
    var y = d3.scale.linear()
      .domain([0, dataMax])
      .range([height, 0]);

    // y position of numbers
    var yFcn = function(d, obj) {
      //console.log(obj.getBBox())
      if (height-y(d)-5 < obj.getBBox().width)
        return y(d)-5;
      else
        return y(d)+5;
    }

    // bar and text styling
    rect
      .attr("y", y(d))
      .attr("width", barWidth - 1)
      .attr("height", height - y(d));
    text
      .text(d)
      .attr("x", barWidth / 2)
      .attr("y", yFcn(d, text.node()))
      .attr("dy", ".375em")
      .attr("transform", "rotate(90,{0},{1})".format(barWidth/2, yFcn(d, text.node())))
      .attr("id", "boxSize "+i);
    console.log(text.node().getBBox())

    // over-bar numbers (for short bars)
    if (height-y(d)-5 < text.node().getBBox().width) {
      text.style("text-anchor", "end");
      text.style("fill", "steelblue");
    }
  }

  this.init.apply(this, arguments);
}
