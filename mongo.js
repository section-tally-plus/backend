var MongoClient = require('mongodb').MongoClient;
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://root:Senior-project321@cluster0.u1zph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

/*
async function run(str) {
  try {
    await client.connect();
    const database = client.db("sandbox");
    const coll = database.collection("mycollection");
    // create a document to insert
    const doc = str
    const result = await coll.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
*/
const fs = require("fs");
var f1 = "json\\" + "202220";
var f2 = "json\\" + "202220old";
let data1 = JSON.parse(fs.readFileSync(f1 + ".json"));
let data2 = JSON.parse(fs.readFileSync(f2 + ".json"));


upload(data1);

function upload(str){
  var mystr = JSON.stringify(str, null, 2);
  MongoClient.connect(uri, function(err, db){
  if (err) throw err;
  var dbo = db.db("sandbox");
  for(x in str){
    //console.log(x)
  }
  dbo.collection("mycollection").insertMany(str, function(err, res){
    if (err) throw err;
    console.log('inserted');
    db.close();
  });
  });
}