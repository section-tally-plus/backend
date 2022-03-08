const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
require("dotenv").config();
const { MONGODB_URI } = process.env;

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect(async (err) => {
  if (err) {
    console.log(err);
  }
  const collection = client.db("saction-tally1").collection("test2");
  // perform actions on the collection object
  const data = await collection
    .find({ Crse: { $in: ["08305", "L6101"] } })
    .toArray();

  fs.writeFile("./data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  console.log(data.length);
  client.close();
});
