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

function createDataset(d, fname) {
  /*
   * Name dataset
   * - making sure it doesn't conflict with existing datasets
   */

  var name = fname.substring(0, fname.lastIndexOf('.')).toLowerCase();
  var id = "csvdata_" + name;

  // append number to id if there are duplicates
  // get existing ids
  var ids = []
  var datasets = d3.selectAll(".dataset").each(function() {
    ids.push($(this).attr("id"))
  })
  // increase number until we find a unique one
  if (ids.indexOf(id) > -1) {
    var ind = 0;
    id = id.concat(ind.toString());
    while (ids.indexOf(id) > -1) {
      id = id.substring(0, id.length-1).concat((++ind).toString());
    }
  }

  // Dataset(id, data, parent_node)
  var ds = new Dataset(id, fname, d, document.getElementById("datasets"));
}
