upload();

function upload() {
  var MongoClient = require("mongodb").MongoClient;
  const { MONGODB_URI } = process.env;
  var url = MONGODB_URI;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("saction-tally1");

    dbo
      .collection("test2")
      .insertOne({
        CRN: "12345",
        Subj: "JM",
        Crse: "123456",
        Sect: "  1",
        "Part of Term": "Full Term ... \n06-SEP to 21-DEC",
        Session: "Day",
        Title: "Test Title.\n",
        Prof: "James, Merc",
        "Day  Beg   End   Bldg Room  (Type)":
          "MW      1230 1345 BUSN 121 (Class)",
        Campus: "Main",
        AddlInfo: "",
        Hrs: 3,
        Max: 20,
        MaxResv: 0,
        LeftResv: 0,
        Enr: 0,
        Avail: 20,
        WaitCap: 0,
        WaitCount: 0,
        WaitAvail: 0,
        "Room Cap": "40",
      })
      .then(function (result) {
        console.log(result);
        db.close();
      });
  });
}
