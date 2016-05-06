
/*
 * File loading
 */

function load_file(file, table) {
  if (!file) {
    return null;
  }
  if (typeof file == "string") {
    $("#status").text("Loading file '" + file + "'...");
    $.get(file, {}, function(data, textStatus) {
      if(textStatus != "success") {
        file_loaded(file, null, false, table);
        return;
      }
      file_loaded(file, data, true, table);
    });
  } else { // typeof file == File
    $("#status").text("Loading local file '" + file.name + "'...");
    var reader = new FileReader();
    reader.onload = function (event) {
      file_loaded(file.name, event.target.result, true, table);
    }
    reader.onerror = function (event) {
      // why not display the error here directly?
      file_loaded(file.name, null, false, table);
    }
    reader.readAsText(file);
  }
}

function file_loaded(fname, content, success, table) {
  if (success) {
    var file_type = fname.substring(fname.lastIndexOf('.') + 1).toLowerCase();
    $("#status").text("Reading " + file_type + " file...");
    console.log("Reading " + file_type + " file...");
    var edges;
    $("#status").text(fname + " loaded");
    console.log(fname + " loaded");
    showData(d3.csv.parse(content), table);
  } else {
    // why do this here and not in the callback itself?
    $("#status").text("Error parsing file '" + fname + "'.");
  }
}
