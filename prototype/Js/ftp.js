document.getElementById('UploadFile').addEventListener('change', readFile, false);
function readFile (evt) {
  var files = evt.target.files;
  var file = files[0];           
  var reader = new FileReader();
  reader.onload = function() {
    console.log(this.result);            
  }
  reader.readAsText(file)
}
