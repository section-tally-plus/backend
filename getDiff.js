const fs = require("fs");
//change this filename to get other semesters
var f1 = "202220f";
var f2 = "202220fnew"
let data1 = JSON.parse(fs.readFileSync(f1 + ".json"));
let data2 = JSON.parse(fs.readFileSync(f2 + ".json"));
var diff = require('deep-diff').diff;

const titles = [];

//console.log(diffTitle(data1, data2));
console.log(gd2(data1, data2));

function diffTitle(d1, d2){
  // loop through each title
  for (const x in data2){
    var differences = diff(data1[x].sectionData, data2[x].sectionData);
    // change detected
    if (differences !== undefined){
      // maybe put for loop here
      titles.push(data1[x].Title);
      console.log(data1[x].sectionData[differences[0].path[0]].CRN);
    }
  }
  return titles;
}

// if crn is needed
function gd2(d1, d2){
  for(x in data2){
    for(y in data2[x].sectionData){
      var d = diff(data1[x].sectionData[y], data2[x].sectionData[y]);
      if (d !== undefined){
        console.log(data2[x].sectionData[y].CRN);
        console.log(d);
      }
    }
  }
}


