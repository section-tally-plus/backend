const {MongoClient} = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
let removeWatching = ["L6101CHEM"] //Class you want to remove
//let removeWatching = ["20334ACC"]
var email = "chuck@rowan.students.edu"

async function main(){
    const uri = "";//insert mongodb connection string
   
    const client = new MongoClient(uri);

        await client.connect();
        
        await findUser(client,
            {
                email: email

    
            }
        );
  
        if (oldWatch.length > 0)
        {
            console.log("in");
            i = oldWatch.length - 1;
            c = removeWatching.length - 1;
            while(i >= 0)
            {
        
                while(c >= 0)
                {
                   
                    if(removeWatching[c] === oldWatch[i])
                    {
                        if(oldWatch[i+1] == null)
                        {
                            oldWatch.pop()
                        }
                        else
                        {
                            oldWatch[i] = ""
                            k = i
        
                            while(k < oldWatch.length - 1)
                            {
                                
                                oldWatch[k] = oldWatch[k + 1];
                                k ++;
                            }
        
                            oldWatch.pop()
                        }
        
                    }
                    c --;
                }
                c = removeWatching.length -1;
        
                i --;
            }
        
        
        }

        i = removeWatching.length - 1;
        while(i >= 0)
        {
            //res = await client.db("section_tally_plus").collection("user").findOne({email: email}); //User Document
            var key = removeWatching[i]; 
            console.log(key);


            if((/[a-zA-Z]/).test(key.charAt(0)))  //Splis up key into subj and crse
            {
                var front = key.charAt(0);
                key = key.replace(key.charAt(0), '');

                word = key.replace(/[0-9]/g, '');
                num = key.replace(/\D/g,'');
                num = num.toString();
                num = front + num;
            }
            else
            {
                word = key.replace(/[0-9]/g, '');
                num = key.replace(/\D/g,'');
                num = num.toString();
            }

            querey = {"Subj": word, "Crse": num}
            clss = await client.db("section_tally_plus").collection("stp_202220").findOne(querey); //Find class that will be favorited
            clssArray = await client.db("section_tally_plus").collection("stp_202220").find(querey).toArray();
            console.log(clssArray.length);

            console.log(clssArray[0].sectionData[0].Favorites);
            //console.log(clss);
            if(clss.sectionData[i])
            {
                newClss = clss.sectionData[i].Favorites - 1  // subtract 1 to favorites
               var newValue = 0;
               var q2 = 0;
               c = 0;
                while(c <= clssArray.length - 1)  //Goes through all classes with same Subj and Crse
                {
                    k = 0

                    while(k <= clssArray[c].sectionData.length - 1)  //If class has multiple sectionData Objects
                    {
                        //console.log(clssArray[c].sectionData[k].Favorites);

                        j = 0;
                        while(j <= clssArray[c].sectionData.length - 1)
                        {
                            q2 = {"_id": clssArray[c]._id}
                            setter = { "$set": {} };
                            setter["$set"]["sectionData."+k+".Favorites"] = newClss; //set Favorites value = Favorites - 1

                            await client.db("section_tally_plus").collection("stp_202220").updateOne(q2, setter); //update Favorites field
                            j ++;
                        }
                            k ++;
                    }

                    c ++;
                }

            }
            i --;
        }





        await removeWatch(client,
            {
                email: email,
            },
            oldWatch
        );
        


        await client.close();

}

main().catch(console.error);


async function findUser(client, newUser){  //find document with specified email

    const result = await client.db("section_tally_plus").collection("user").findOne(newUser);
    oldWatch = result.watching;
    return oldWatch;  //return the current watching array of classes
    
}

async function removeWatch(client, email, oldWatch){  //update document with new watching array
    const result = await client.db("section_tally_plus").collection("user").findOne(email);
    var q = { "_id": ObjectID(result._id)}
    var newValue = { $set: {"watching": oldWatch } };
    console.log(email);
    await client.db("section_tally_plus").collection("user").updateOne(q, newValue);
}