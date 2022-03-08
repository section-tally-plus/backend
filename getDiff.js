const fs = require("fs");
//change this filename to get other semesters
var f1 = "202220f";
var f2 = "202220fnew"
let data1 = JSON.parse(fs.readFileSync(f1 + ".json"));
let data2 = JSON.parse(fs.readFileSync(f2 + ".json"));
var diff = require('deep-diff').diff;

const titles = [];
const secData = [];

//console.log(diffTitle(data1, data2));
getDiff(data1, data2);
console.log(titles + '\n' + secData);

function getDiff(d1, d2){
	// loop through each class
	console.log(d1[32].sectionData.length);
	
  	for(x in d2){
	// loop through each section of x class
    	for(y in d2[x].sectionData){
		// check for diff in x class section
      	var d = diff(d1[x].sectionData[y], d2[x].sectionData[y]);
	      if (d !== undefined){
			titles.push(d1[x].Title);
			secData.push(d2[x].sectionData[y].CRN);
        	//console.log(d);
      	}
    }
  }
}


