const fs = require("fs");
//change this filename to get other semesters
var f1 = "json\\" + "202220";
var f2 = "json\\" + "202220old";
let data1 = JSON.parse(fs.readFileSync(f1 + ".json"));
let data2 = JSON.parse(fs.readFileSync(f2 + ".json"));
var diff = require('deep-diff').diff;

const crsNum = [];
const subj = [];

//console.log(diffTitle(data1, data2));
getDiff(data1, data2);
console.log(crsNum + '\n' + subj);

function getDiff(d1, d2){
	// loop through each class
	//console.log(d1[32].sectionData.length);
	
  	for(x in d2){
	// loop through each section of x class
    	for(y in d2[x].sectionData){
		// check for diff in x class section
      	var d = diff(d1[x].sectionData[y], d2[x].sectionData[y]);
	      if (d !== undefined && !crsNum.includes(d2[x].Crse)){
			crsNum.push(d2[x].Crse);
			subj.push(d2[x].Subj);
        	//console.log(d);
      	}
    }
  }
}


