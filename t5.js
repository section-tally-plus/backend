const XLSX = require("xlsx");
var XMLHttpRequest = require("xhr2");
var fs = require("fs");
var current_terms = ["202220", "202230", "202240"];
var req = new Array();
const { MONGODB_URI } = process.env;

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:Senior-project321@cluster0.u1zph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

start();

function start() {
  // make request objects
  for (let i = 0; i < current_terms.length; i++) {
    req[i] = new XMLHttpRequest();
    req[i].responseType = "arraybuffer";
  }

  for (let i = 0; i < current_terms.length; i++) {
    var url =
      "https://banner.rowan.edu/reports/reports.pl?term=" +
      current_terms[i] +
      "&task=Section_Tally&coll=ALL&dept=ALL&subj=ALL&ptrm=ALL&sess=ALL&prof=ALL&attr=ALL&camp=ALL&bldg=ALL&Search=Search&format=excel";
    req[i].open("GET", url, true);
    req[i].send();

    req[i].onload = function(e) {
      console.log(current_terms[i] + " response");
      //write_json(to_json_str(req[i].response), i);
      //var data = to_json_str(req[i].response)
      var res = to_json_str(req[i].response);
      upload(res, current_terms[i]);
      //console.log(data)
    };
  }
  
}

function to_json_str(a) {
  var arraybuffer = a;
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for (var x = 0; x != data.length; ++x) arr[x] = String.fromCharCode(data[x]);
  var bstr = arr.join("");
  var workbook = XLSX.read(bstr, { type: "binary" });
  // read first sheet (identified by first of SheetNames)
  let sheet = workbook.Sheets[workbook.SheetNames[0]];
  // convert to JSON
  var json = XLSX.utils.sheet_to_json(sheet);
  var mystr = convert(json);
  return mystr;
}

function convert(json_data){
	let temp = Object.values(
  	json_data.reduce(
    (
      a,
      {
        Crse,
        Subj,
        CRN,
        Title,
        Prof,
        Sect,
        Campus,
		    Hrs,
        Max,
        MaxResv,
        LeftResv,
        Enr,
        Avail,
        WaitCap,
        WaitCount,
        WaitAvail,
        Room,
        Cap,
        "Part of Term": PartOfTerm,
        "Day  Beg   End   Bldg Room  (Type)": meetingInfo,
      }
    ) => {
      let num = Title;
      const idkey = num.replace(/ /g, "_");
      if (!a[num]) {
        a[num] = { _id: idkey, Title, Subj, Crse, Hrs, sectionData: [] };
      }
      parsedData = parseMeeting(meetingInfo);
      a[num].sectionData.push({
        CRN,
        PartOfTerm,
        Sect,
        Campus,
        Prof,
        Avail,
        Max,
        MaxResv,
        LeftResv,
        Enr,
        Avail,
        WaitCap,
        WaitCount,
        WaitAvail,
        Room,
        Cap,
        Favorites: 0,
        meetingData: parsedData,
      });
      return a;
    },
    {}
  )
);
	//return JSON.stringify(temp, null, 2);
  return temp
}

function parseMeeting(meetingString) {
  let splitString = meetingString.split("\n");
  let a = [];
  splitString.forEach((str) => {
    let strArr = str.split(" ");
    let infoArr = strArr.filter((x) => x != "");
    let tempObj = {
      day: infoArr[0],
      start: infoArr[1],
      end: infoArr[2],
      building: infoArr[3],
      room: infoArr[4],
      type: infoArr[5],
    };
    a.push(tempObj);
  });
  return a;
}

function upload(str, term){
  console.log('upload');
  MongoClient.connect(uri, function(err, db){
  if (err) throw err;
  var dbo = db.db("sandbox");
  dbo.collection(term.toString()).insertMany(str, function(err, res){
    if (err) throw err;
    console.log('inserted');
    db.close();
  });
  });
}


/*
function run(str) {
  try {
    client.connect();
    const database = client.db("sandbox");
    const coll = database.collection("mycollection");
    // create a document to insert
    const doc = str
    const result = coll.insertOne(doc);
    console.log(`A document was inserted`);
  } finally {
    client.close();
  }
}
run().catch(console.dir);
*/

function write_json(string, i) {
  fs.writeFile("json\\" + current_terms[i] + ".json", string, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("written");
  });
}
