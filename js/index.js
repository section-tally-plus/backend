//Charles Stanski and Joe Bene
//Notifications and updating databse
    const {MongoClient} = require('mongodb');
    const XLSX = require("xlsx");
	var XMLHttpRequest = require("xhr2");
	var fs = require("fs");
	var xlsx = require("node-xlsx");
const { diff } = require('jsondiffpatch');
	var test = new XMLHttpRequest();
	
	var current_terms = ["202220"];
	var req = new Array();
	const jsondiffpatch = require('jsondiffpatch').create({
		objectHash: function(index){
			return '$$index:' + index
		}
	});
	
	start();

    

	  function start() {
		
		var userdata;
		
		
		
		  req[0] = new XMLHttpRequest();
		  req[0].responseType = "arraybuffer";
		
	  
		
		  
				

		  var url =
			"https://banner.rowan.edu/reports/reports.pl?term=" +
			current_terms[0] +
			"&task=Section_Tally&coll=ALL&dept=ALL&subj=ALL&ptrm=ALL&sess=ALL&prof=ALL&attr=ALL&camp=ALL&bldg=ALL&Search=Search&format=excel";
		  req[0].open("GET", url, true);
		  req[0].send();
	  
		  req[0].onload = function (e) {
			console.log(current_terms[0] + " response");
		   	var data = to_json_str(req[0].response);


			findUsers(data);
			 
				} 
		
			
		  
		
		}


		async function findUsers(data){
			




			userEmails = new Array();
			courses = new Array();
			subjects = new Array();
			const uri = "mongodb+srv://root:Senior-project321@cluster0.u1zph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";//insert mongodb connection string
			const client = new MongoClient(uri);
			await client.connect();

			await client.db("tempData").collection("test").drop();
			await client.db("tempData").createCollection("test");
			await client.db("tempData").collection("test").insertMany(data);

			
			
			var data3 = await client.db("tempData").collection("test").find({}, { projection: {_id:0, Favorites: 0}}).sort({Subj: 1, Crse: 1}).toArray();
			
			var data4 = await client.db("section_tally_plus").collection("stp_202220").find({}, { projection: {_id:0, Favorites: 0}}).sort({Subj: 1, Crse: 1}).toArray();

			
			//var temp = await client.db("section_tally_plus").collection("stp_202220").find().sort({Subj: 1, Crse: 1}).toArray();
			//await client.db("tempData").collection("test2").insertMany(temp);
			//var temp = await client.db("section_tally_plus").collection("stp_202220").find().sort({Subj: 1, Crse: 1}).toArray();


			usersList = await client.db("section_tally_plus").collection("users").find().toArray();



			const dif = jsondiffpatch.diff(data3, data4);


			

			console.log("")


		

			console.log("")
			
			console.log("")
			console.log("Start Diff:")
			

			console.log(dif)

			
			console.log("End Diff")
			
		
			await client.db("section_tally_plus").collection("stp_202220").drop();
			await client.db("section_tally_plus").createCollection("stp_202220");
			await client.db("section_tally_plus").collection("stp_202220").insertMany(data);

			tempData = await client.db("section_tally_plus").collection("stp_202220").find().toArray();
			//console.log(temp)
			var i = 0;
			while(i <= usersList.length - 1)
			{	
				
				c = 0
				if(usersList[i].watchlist.length != 0)
				{
					while(c <= usersList[i].watchlist.length - 1)
					{

						
						

						clss = await client.db("section_tally_plus").collection("stp_202220").findOne({"Crse": usersList[i].watchlist[c].course, "Subj": usersList[i].watchlist[c].Subj});
						

						if(clss != null)
						{
							fav = clss.Favorites + 1
							

							await client.db("section_tally_plus").collection("stp_202220").updateOne({"Crse": usersList[i].watchlist[c].course, "Subj": usersList[i].watchlist[c].Subj}, { $set: {"Favorites": fav}});
						}
						c ++;

					}
				}
				i ++;
			}
			//Update Favorites end



			
			await client.close();


			if(dif != undefined)
			{
				
				

			
		
			
			count = 0;
			var index = Object.keys(dif);
			console.log(index);
			var course = null;
			var subject = null;
			console.log("Start loop")
			for(let i = 0; i < Object.keys(dif).length; i++)
				{
					console.log("dif length is " + Object.keys(dif).length)
					
					if(Number.isInteger(parseInt(index[i])))
					{
						index[i] = parseInt(index[i]);
						console.log("in int loop");
						console.log(index[i]);
						
						course = tempData[index[i]].Crse;
						subject = tempData[index[i]].Subj;
						console.log(index);
					}
					
					for(let j = 0; j < usersList.length; j++)
					{	
						
						for(let x = 0; x < usersList[j].watchlist.length; x++ )
						{
							
							if(usersList[j].watchlist[x].Subj === subject && usersList[j].watchlist[x].course === course)
							{
								 userEmails[count] = (usersList[j].email); 
								 courses[count] = course;
								 subjects[count] = subject;
								 const sgMail = require('@sendgrid/mail')
					sgMail.setApiKey('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')

const msg = {
  to: userEmails[i], // Change to your recipient
  from: 'sectiontallyplusRU@gmail.com', // Change to your verified sender
  subject: 'There has been a change to a course on your watchlist!',
  text: 'There has been a change to the course that you are watching: ' + subject  + ' ' + course,
  html: 'There has been a change to the course that you are watching: ' + subject  + ' ' + course,
}

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  })

					
				};
		
		}
								 count++;
							}
						}
						console.log("End Loop")

						
					
		};
					
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
			"Part of Term": PartOfTerm,
			"Day  Beg   End   Bldg Room  (Type)": meetingInfo,
		  }
		) => {
		  let num = Title;
		  const idkey = num.replace(/ /g, "_");
		  if (!a[num]) {
			a[num] = { _id: idkey, Title, Subj, Favorites: 0, Crse, Hrs, sectionData: [] };
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
			meetingData: parsedData,
		  });
		  return a;
		},
		{}
	  )
	);
		
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

