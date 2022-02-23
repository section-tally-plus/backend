const fs = require("fs");
//change this filename to get other semesters
let rawdata = fs.readFileSync("202240.json");
let data = JSON.parse(rawdata);
let temp = Object.values(
  data.reduce(
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
        Favorites: 0,
        meetingData: parsedData,
      });
      return a;
    },
    {}
  )
);
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

fs.writeFile(
  "./formattedData.json",
  JSON.stringify(temp, null, 2),
  function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }
);
