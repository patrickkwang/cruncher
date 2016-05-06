function startup() {
  // callback for recomputing data statistics
  $("#dataset0 div.data").change(function(){
    var data = tableToArray(d3.select(this));
    $(".mean").text(mean(data).toString());
    $(".stdv").text(stdv(data).toString());
    //updateBar(d3.select(".chart"),data);
  });

  // callback for iCDF
  $("#dataset0 div.icdf").submit(function(){
    var val = formToArray($(this));
    console.log(icdf(data,val))
    return false;
  });

  // initialize data statistics
  var data = tableToArray(d3.select("#dataset0 div.data table"));
  $(".mean").text(mean(data).toString());
  $(".stdv").text(stdv(data).toString());
  var meanSamples = []
  var edges = [0.5,1.5,2.5,3.5,4.5,5.5];
  createBar(d3.select(".chart"),histogram(meanSamples,edges));

  // callback for sample1
  $("#dataset0 button.sample1").click(function(){
    var data = tableToArray(d3.select("#dataset0 div.data"));
    var keys = d3.keys(data);
    data = data[keys[0]];
    meanSamples.push(mean(bootstrap(data,data.length)));
    updateBar(d3.select(".chart"),histogram(meanSamples,edges))
  });

  // callback for sample10
  $("#dataset0 button.sample10").click(function(){
    var data = tableToArray(d3.select("#dataset0 div.data"));
    var keys = d3.keys(data);
    data = data[keys[0]];
    for (iSample=0; iSample<10; iSample++)
      meanSamples.push(mean(bootstrap(data,data.length)));
    updateBar(d3.select(".chart"),histogram(meanSamples,edges))
  });

  // callback for sample100
  $("#dataset0 button.sample100").click(function(){
    var data = tableToArray(d3.select("#dataset0 div.data table"));
    var keys = d3.keys(data);
    data = data[keys[0]];
    for (iSample=0; iSample<100; iSample++)
      meanSamples.push(mean(bootstrap(data,data.length)));
    updateBar(d3.select(".chart"),histogram(meanSamples,edges))
  });

  // drag/drop file handling
  var state = document.getElementById('status');
  var holder = document.getElementById('file_drop');

  if (typeof window.FileReader === 'undefined') {
    state.innerHTML = 'Your browser does not support local file reading';
  }

  holder.ondragover = function () { this.style.borderColor = '#009900'; return false; };
  holder.ondragend = function () { this.style.borderColor = '#333333'; return false; };
  holder.ondrop = function (e) {
    this.style.borderColor = '#333333';
    e.preventDefault();

    var file = e.dataTransfer.files[0];

    console.log("File size: " + file.size);
    if(file.size > 100000000) {
      var doit = confirm("The file you are attempting to load is over 100Mb. This may cause your browser and computer to freeze. Do you wish to proceed?");
      if (!doit) {
        $("#status").text(file.name + " not loaded");
        return false;
      }
    }

    load_file(file, d3.select("#dataset0 div.data table"));
    return false;
  };
}
