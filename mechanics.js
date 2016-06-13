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

var current_sheet;
var current_tab;
function load_tab(tab, sheet_id) {
  var sheet = document.getElementById(sheet_id);
  current_sheet.style.display = "none";
  current_tab.style.borderBottom = "1px solid #333333";
  tab.style.borderBottom = "1px solid #FFFFFF";
  sheet.style.display = "block";
  current_tab = tab;
  current_sheet = sheet;
}

var datasets = [];

function createDataset(d, fname, genFcn = function(){return null;}) {
  /*
   * Name dataset
   * - making sure it doesn't conflict with existing datasets
   */

  var id = fname;

  // append number to id if there are duplicates
  // get existing ids
  var ids = [];
  for(var i = 0; i < datasets.length; i++) {
    ids.push(datasets[i].name);
  }
  // increase number until we find a unique one
  if (ids.indexOf(id) > -1) {
    var ind = 0;
    id = id.concat(ind.toString());
    while (ids.indexOf(id) > -1) {
      id = id.substring(0, id.length-1).concat((++ind).toString());
    }
  }

  // Dataset(id, data, parent_node)
  var ds = new Dataset(id, fname, d, document.getElementById("datasets"), genFcn);
  datasets.push(ds);
};

function get_dataseries(id) {
  var dataset = id.substring(0, id.indexOf("/"));
  var column = id.substring(id.indexOf("/")+1, id.length);
  for(var i = 0; i < datasets.length; i++) {
    if(datasets[i].name == dataset) {
      for(var j = 0; j < datasets[i].columns.length; j++) {
        if(datasets[i].columns[j] == column) {
          return datasets[i].data[datasets[i].columns[j]];
        }
      }
    }
  }
  console.error("Data series '" + id + "' not found.");
  return null;
}

function analyze() {
  var analysisType = document.getElementById("analysisType").value;
  var dataSeriesName = [document.getElementById("dataSeries0").value, document.getElementById("dataSeries1").value];
  var differences = getData(dataSeriesName, analysisType);
  var dsArray = [];
  for (var i=0; i<differences.length; i++)
    dsArray.push([differences[i]]);
  createDataset(dsArray, 'differences', function() {return getData(dataSeriesName, analysisType);})
}

function getData(dataSeriesName, analysisType) {
  var dataSeries = [get_dataseries(dataSeriesName[0]), get_dataseries(dataSeriesName[1])];
  switch (analysisType) {
    case "means":
      var nSamples = 100;
      var meanSamples = [[],[]];
      for (var iSeries=0; iSeries<2; iSeries++) {
        var series = dataSeries[iSeries];
        for (var iSample=0; iSample<nSamples; iSample++)
          meanSamples[iSeries].push(mean(bootstrap(series, series.length)))
      }
      var differences = subtractArrays(meanSamples[0], meanSamples[1], nSamples);
      break;
    case "standard deviations":
      console.log("not yet implemented");
      return;
    default:
      console.log("unknown analysis type");
      return;
  }
  return differences;
}
