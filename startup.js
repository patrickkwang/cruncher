function startup() {
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

    load_file(file);
    return false;
  };

  current_sheet = document.getElementById("sheet1");
  current_sheet.style.display = "block";
  current_tab = document.getElementById("tab1");
  current_tab.style.borderBottom = "1px solid #FFFFFF";

  // prepare Go! button for multi-dataset analysis
  var goButton = document.getElementById("analyzeButton");
  goButton.onclick.dataSeries = [null,null]
}
