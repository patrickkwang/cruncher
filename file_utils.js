
/*
 * File loading
 */

function load_file(file) {
  if (!file) {
    return null;
  }
  if (typeof file == "string") {
    $("#status").text("Loading file '" + file + "'...");
    $.get(file, {}, function(data, textStatus) {
      if(textStatus != "success") {
        file_loaded(file, null, false);
        return;
      }
      file_loaded(file, data, true);
    });
  } else { // typeof file == File
    $("#status").text("Loading local file '" + file.name + "'...");
    var reader = new FileReader();
    reader.onload = function (event) {
      file_loaded(file.name, event.target.result, true);
    }
    reader.onerror = function (event) {
      // why not display the error here directly?
      file_loaded(file.name, null, false);
    }
    reader.readAsText(file);
  }
}

function file_loaded(fname, content, success) {
  if (success) {
    $("#status").text("Reading " + fname + "...");
    console.log("Reading " + fname + "...");
    var edges;
    $("#status").text(fname + " loaded");
    console.log(fname + " loaded");
    return createDataset(d3.csv.parseRows(content), fname);
  } else {
    // why do this here and not in the callback itself?
    $("#status").text("Error parsing file '" + fname + "'.");
  }
}
