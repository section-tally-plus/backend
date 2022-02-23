const XLSX = require('xlsx');
var XMLHttpRequest = require('xhr2');
var fs = require('fs')
var xlsx = require('node-xlsx');
var test = new XMLHttpRequest();
var current_terms = ['202220','202230','202240'];
var req = new Array();

start();

function start(){
  // make request objects
  for(let i=0;i<current_terms.length;i++){
    req[i] = new XMLHttpRequest();
    req[i].responseType = 'arraybuffer';
  }

  for(let i=0; i<current_terms.length; i++){
    var url = "https://banner.rowan.edu/reports/reports.pl?term="
    + current_terms[i] + "&task=Section_Tally&coll=ALL&dept=ALL&subj=ALL&ptrm=ALL&sess=ALL&prof=ALL&attr=ALL&camp=ALL&bldg=ALL&Search=Search&format=excel";
    req[i].open("GET", url, true);
    req[i].send();

    req[i].onload = function(e) {
      console.log(current_terms[i] + ' response');
      write_json(to_json_str(req[i].response), i);
    }
  }
}

function to_json_str(a) {
  var arraybuffer = a;
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for(var x = 0;x != data.length; ++x) arr[x] = String.fromCharCode(data[x]);
  var bstr = arr.join("");
  var workbook = XLSX.read(bstr, {type:"binary"});
  // read first sheet (identified by first of SheetNames)
  let sheet = workbook.Sheets[workbook.SheetNames[0]];
  // convert to JSON
  var json = XLSX.utils.sheet_to_json(sheet);
  //make_csv()
  var str = JSON.stringify(json);
  return str;
}

function write_json(string, i){
  fs.writeFile(current_terms[i] + '.json', string, function(err){
    if(err) {
        return console.log(err);
    }
    console.log('written');
  });
}
